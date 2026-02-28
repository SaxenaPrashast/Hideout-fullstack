import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { ClientToServerEvents, ServerToClientEvents } from '../types';
import { Socket } from 'socket.io-client';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface UseSocketReturn {
  socket: TypedSocket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
}

export const useSocket = (): UseSocketReturn => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
};
