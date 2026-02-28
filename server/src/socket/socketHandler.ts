import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Message from '../models/Message';
import Room from '../models/Room';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  SocketEvent,
  MessageType,
} from '../types';

type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// Map of userId → socketId
const onlineUsers = new Map<string, string>();

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const setupSocketHandler = (io: TypedServer): void => {
  // Authentication middleware for socket connections
  io.use(async (socket: TypedSocket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const secret = process.env.JWT_SECRET || 'your_super_secret_key_here';
      const decoded = jwt.verify(token, secret) as JwtPayload;

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.data.userId = user._id.toString();
      socket.data.username = user.username;

      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket: TypedSocket) => {
    const userId = socket.data.userId;
    const username = socket.data.username;

    console.log(`User connected: ${username} (${userId})`);

    // Store socket mapping
    onlineUsers.set(userId, socket.id);

    // Update user online status
    await User.findByIdAndUpdate(userId, { isOnline: true });

    // Notify all clients about user coming online
    socket.broadcast.emit(SocketEvent.USER_ONLINE, { userId });

    // Join all user's rooms
    const userRooms = await Room.find({ members: userId });
    for (const room of userRooms) {
      socket.join(room._id.toString());
    }

    // Handle joining a room
    socket.on(SocketEvent.JOIN_ROOM, async (data: { roomId: string }) => {
      try {
        const { roomId } = data;
        socket.join(roomId);
        console.log(`${username} joined room ${roomId}`);
      } catch (error) {
        socket.emit(SocketEvent.ERROR, { message: 'Error joining room' });
      }
    });

    // Handle leaving a room
    socket.on(SocketEvent.LEAVE_ROOM, (data: { roomId: string }) => {
      const { roomId } = data;
      socket.leave(roomId);
      console.log(`${username} left room ${roomId}`);
    });

    // Handle sending a message
    socket.on(
      SocketEvent.SEND_MESSAGE,
      async (data: { roomId: string; content: string; type: MessageType }) => {
        try {
          const { roomId, content, type } = data;

          const message = await Message.create({
            sender: userId,
            room: roomId,
            content: content.trim(),
            type: type || MessageType.TEXT,
            readBy: [userId],
          });

          // Update room's lastMessage
          await Room.findByIdAndUpdate(roomId, {
            lastMessage: message._id,
          });

          const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username avatar isOnline')
            .populate('readBy', 'username');

          if (populatedMessage) {
            io.to(roomId).emit(SocketEvent.NEW_MESSAGE, populatedMessage);
          }
        } catch (error) {
          socket.emit(SocketEvent.ERROR, { message: 'Error sending message' });
        }
      }
    );

    // Handle typing start
    socket.on(SocketEvent.TYPING_START, (data: { roomId: string }) => {
      const { roomId } = data;
      socket.to(roomId).emit(SocketEvent.USER_TYPING, {
        userId,
        username,
        roomId,
      });
    });

    // Handle typing stop
    socket.on(SocketEvent.TYPING_STOP, (data: { roomId: string }) => {
      const { roomId } = data;
      socket.to(roomId).emit(SocketEvent.USER_STOPPED_TYPING, {
        userId,
        roomId,
      });
    });

    // Handle mark as read
    socket.on(
      SocketEvent.MARK_READ,
      async (data: { roomId: string; messageId: string }) => {
        try {
          const { roomId, messageId } = data;

          const message = await Message.findById(messageId);
          if (message) {
            const alreadyRead = message.readBy.some(
              (id) => id.toString() === userId
            );
            if (!alreadyRead) {
              message.readBy.push(userId as unknown as import('mongoose').Types.ObjectId);
              await message.save();
            }

            io.to(roomId).emit(SocketEvent.MESSAGE_READ, {
              messageId,
              userId,
            });
          }
        } catch (error) {
          socket.emit(SocketEvent.ERROR, {
            message: 'Error marking message as read',
          });
        }
      }
    );

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${username} (${userId})`);

      onlineUsers.delete(userId);

      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      socket.broadcast.emit(SocketEvent.USER_OFFLINE, { userId });
    });
  });
};
