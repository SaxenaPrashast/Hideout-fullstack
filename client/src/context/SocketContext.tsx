import React, { createContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketEvent,
} from '../types';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: TypedSocket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
});

interface SocketProviderProps {
  children: React.ReactNode;
}

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<TypedSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const socketRef = useRef<TypedSocket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers(new Set());
      }
      return;
    }

    // Prevent reconnecting if socket already exists and is connected
    if (socketRef.current?.connected) {
      return;
    }

    const newSocket: TypedSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on(SocketEvent.USER_ONLINE, ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.add(userId);
        return next;
      });
    });

    newSocket.on(SocketEvent.USER_OFFLINE, ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    newSocket.on(SocketEvent.ERROR, ({ message }) => {
      console.error('Socket error:', message);
    });

    setSocket(newSocket);

    return () => {
      // Only disconnect if this is a real unmount, not StrictMode double-invoke
      // Use setTimeout to allow re-mount to cancel the disconnect
      const socketToClose = socketRef.current;
      socketRef.current = null;
      
      setTimeout(() => {
        if (socketToClose && !socketRef.current) {
          socketToClose.disconnect();
          setSocket(null);
          setIsConnected(false);
        }
      }, 100);
    };
  }, [isAuthenticated, token]);

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
