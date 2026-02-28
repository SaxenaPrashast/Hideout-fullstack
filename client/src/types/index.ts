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

// ===== Data Interfaces =====

export interface IUser {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IMessage {
  _id: string;
  sender: IUser;
  room: string;
  content: string;
  type: MessageType;
  readBy: IUser[];
  createdAt: string;
  updatedAt?: string;
}

export interface IRoom {
  _id: string;
  name: string;
  isGroup: boolean;
  members: IUser[];
  lastMessage: IMessage | null;
  createdAt: string;
  updatedAt?: string;
}

// ===== API Types =====

export interface AuthResponse {
  user: IUser;
  token: string;
}

export interface MessagesResponse {
  messages: IMessage[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
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

// ===== Component Prop Types =====

export interface TypingUser {
  userId: string;
  username: string;
}
