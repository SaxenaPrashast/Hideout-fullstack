import { Response } from 'express';
import mongoose from 'mongoose';
import Room from '../models/Room';
import Message from '../models/Message';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { MessageType } from '../types';

export const getRooms = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const rooms = await Room.find({ members: req.user._id })
      .populate('members', '-password')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' },
      })
      .sort({ updatedAt: -1 });

    res.json(rooms);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error fetching rooms' });
  }
};

export const createOrGetDMRoom = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { memberId } = req.body as { memberId: string };

    if (!memberId) {
      res.status(400).json({ message: 'Member ID is required' });
      return;
    }

    if (memberId === req.user._id.toString()) {
      res.status(400).json({ message: 'Cannot create DM with yourself' });
      return;
    }

    const otherUser = await User.findById(memberId);
    if (!otherUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if DM room already exists
    const existingRoom = await Room.findOne({
      isGroup: false,
      members: {
        $all: [req.user._id, new mongoose.Types.ObjectId(memberId)],
        $size: 2,
      },
    })
      .populate('members', '-password')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' },
      });

    if (existingRoom) {
      res.json(existingRoom);
      return;
    }

    const newRoom = await Room.create({
      name: '',
      isGroup: false,
      members: [req.user._id, new mongoose.Types.ObjectId(memberId)],
    });

    const populatedRoom = await Room.findById(newRoom._id)
      .populate('members', '-password')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' },
      });

    res.status(201).json(populatedRoom);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error creating room' });
  }
};

export const createGroupRoom = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { name, memberIds } = req.body as {
      name: string;
      memberIds: string[];
    };

    if (!name || !memberIds || memberIds.length === 0) {
      res.status(400).json({ message: 'Group name and members are required' });
      return;
    }

    const allMembers = [
      req.user._id,
      ...memberIds.map((id) => new mongoose.Types.ObjectId(id)),
    ];

    // Remove duplicates
    const uniqueMembers = [...new Set(allMembers.map((m) => m.toString()))].map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const newRoom = await Room.create({
      name,
      isGroup: true,
      members: uniqueMembers,
    });

    const populatedRoom = await Room.findById(newRoom._id)
      .populate('members', '-password')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' },
      });

    res.status(201).json(populatedRoom);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error creating group room' });
  }
};

export const getRoomMessages = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { roomId } = req.params;
    const { cursor, limit = '30' } = req.query as {
      cursor?: string;
      limit?: string;
    };

    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const isMember = room.members.some(
      (m) => m.toString() === req.user!._id.toString()
    );
    if (!isMember) {
      res.status(403).json({ message: 'Not a member of this room' });
      return;
    }

    const query: Record<string, unknown> = { room: roomId };
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const parsedLimit = Math.min(parseInt(limit, 10) || 30, 50);

    const messages = await Message.find(query)
      .populate('sender', 'username avatar isOnline')
      .populate('readBy', 'username')
      .sort({ createdAt: -1 })
      .limit(parsedLimit);

    const hasMore = messages.length === parsedLimit;
    const nextCursor =
      hasMore && messages.length > 0
        ? messages[messages.length - 1].createdAt.toISOString()
        : null;

    res.json({
      messages: messages.reverse(),
      hasMore,
      nextCursor,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { roomId } = req.params;
    const { content, type = MessageType.TEXT } = req.body as {
      content: string;
      type?: MessageType;
    };

    if (!content || !content.trim()) {
      res.status(400).json({ message: 'Message content is required' });
      return;
    }

    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const isMember = room.members.some(
      (m) => m.toString() === req.user!._id.toString()
    );
    if (!isMember) {
      res.status(403).json({ message: 'Not a member of this room' });
      return;
    }

    const message = await Message.create({
      sender: req.user._id,
      room: roomId,
      content: content.trim(),
      type,
      readBy: [req.user._id],
    });

    // Update room's lastMessage
    room.lastMessage = message._id;
    await room.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatar isOnline')
      .populate('readBy', 'username');

    res.status(201).json(populatedMessage);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error sending message' });
  }
};

export const markMessageAsRead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { msgId } = req.params;

    const message = await Message.findById(msgId);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    const alreadyRead = message.readBy.some(
      (id) => id.toString() === req.user!._id.toString()
    );

    if (!alreadyRead) {
      message.readBy.push(req.user._id);
      await message.save();
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error marking message as read' });
  }
};

export const getUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .sort({ isOnline: -1, username: 1 });

    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error fetching users' });
  }
};
