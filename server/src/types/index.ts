import { Document, Types } from 'mongoose';

// ===== Enums =====

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

export enum SocketEvent {
  // Client → Server
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  SEND_MESSAGE = 'send_message',
  TYPING_START = 'typing_start',
  TYPING_STOP = 'typing_stop',
  MARK_READ = 'mark_read',

  // Server → Client
  NEW_MESSAGE = 'new_message',
  USER_TYPING = 'user_typing',
  USER_STOPPED_TYPING = 'user_stopped_typing',
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline',
  MESSAGE_READ = 'message_read',
  ERROR = 'error',
}

// ===== Document Interfaces =====

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  room: Types.ObjectId;
  content: string;
  type: MessageType;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoom extends Document {
  _id: Types.ObjectId;
  name: string;
  isGroup: boolean;
  members: Types.ObjectId[];
  lastMessage: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

// ===== API Response Types =====

export interface AuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// ===== Socket Event Payloads =====

export interface ClientToServerEvents {
  [SocketEvent.JOIN_ROOM]: (data: { roomId: string }) => void;
  [SocketEvent.LEAVE_ROOM]: (data: { roomId: string }) => void;
  [SocketEvent.SEND_MESSAGE]: (data: {
    roomId: string;
    content: string;
    type: MessageType;
  }) => void;
  [SocketEvent.TYPING_START]: (data: { roomId: string }) => void;
  [SocketEvent.TYPING_STOP]: (data: { roomId: string }) => void;
  [SocketEvent.MARK_READ]: (data: {
    roomId: string;
    messageId: string;
  }) => void;
}

export interface ServerToClientEvents {
  [SocketEvent.NEW_MESSAGE]: (message: IMessage) => void;
  [SocketEvent.USER_TYPING]: (data: {
    userId: string;
    username: string;
    roomId: string;
  }) => void;
  [SocketEvent.USER_STOPPED_TYPING]: (data: {
    userId: string;
    roomId: string;
  }) => void;
  [SocketEvent.USER_ONLINE]: (data: { userId: string }) => void;
  [SocketEvent.USER_OFFLINE]: (data: { userId: string }) => void;
  [SocketEvent.MESSAGE_READ]: (data: {
    messageId: string;
    userId: string;
  }) => void;
  [SocketEvent.ERROR]: (data: { message: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  username: string;
}

// ===== Extended Express Request =====

export interface AuthRequest extends Express.Request {
  user?: IUser;
}
