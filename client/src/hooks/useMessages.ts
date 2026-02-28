import { useState, useEffect, useCallback, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import {
  IMessage,
  MessagesResponse,
  SocketEvent,
  MessageType,
  TypingUser,
} from '../types';

interface UseMessagesReturn {
  messages: IMessage[];
  isLoading: boolean;
  hasMore: boolean;
  typingUsers: TypingUser[];
  sendMessage: (content: string, type?: MessageType) => void;
  loadMoreMessages: () => Promise<void>;
  startTyping: () => void;
  stopTyping: () => void;
  markAsRead: (messageId: string) => void;
}

export const useMessages = (roomId: string | null): UseMessagesReturn => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const cursorRef = useRef<string | null>(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  // Fetch initial messages
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      setHasMore(false);
      cursorRef.current = null;
      return;
    }

    const fetchMessages = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await axiosClient.get<MessagesResponse>(
          `/messages/rooms/${roomId}/messages`
        );
        setMessages(response.data.messages);
        setHasMore(response.data.hasMore);
        cursorRef.current = response.data.nextCursor;
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  // Listen for new messages
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleNewMessage = (message: IMessage): void => {
      if (message.room === roomId) {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.some((m) => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    };

    const handleUserTyping = (data: {
      userId: string;
      username: string;
      roomId: string;
    }): void => {
      if (data.roomId === roomId && data.userId !== user?._id) {
        setTypingUsers((prev) => {
          const exists = prev.some((u) => u.userId === data.userId);
          if (exists) return prev;
          return [...prev, { userId: data.userId, username: data.username }];
        });
      }
    };

    const handleStoppedTyping = (data: {
      userId: string;
      roomId: string;
    }): void => {
      if (data.roomId === roomId) {
        setTypingUsers((prev) =>
          prev.filter((u) => u.userId !== data.userId)
        );
      }
    };

    const handleMessageRead = (data: {
      messageId: string;
      userId: string;
    }): void => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg._id === data.messageId) {
            const alreadyRead = msg.readBy.some(
              (r) => r._id === data.userId
            );
            if (alreadyRead) return msg;
            return {
              ...msg,
              readBy: [
                ...msg.readBy,
                { _id: data.userId } as IMessage['readBy'][0],
              ],
            };
          }
          return msg;
        })
      );
    };

    socket.on(SocketEvent.NEW_MESSAGE, handleNewMessage);
    socket.on(SocketEvent.USER_TYPING, handleUserTyping);
    socket.on(SocketEvent.USER_STOPPED_TYPING, handleStoppedTyping);
    socket.on(SocketEvent.MESSAGE_READ, handleMessageRead);

    return () => {
      socket.off(SocketEvent.NEW_MESSAGE, handleNewMessage);
      socket.off(SocketEvent.USER_TYPING, handleUserTyping);
      socket.off(SocketEvent.USER_STOPPED_TYPING, handleStoppedTyping);
      socket.off(SocketEvent.MESSAGE_READ, handleMessageRead);
    };
  }, [socket, roomId, user?._id]);

  const loadMoreMessages = useCallback(async (): Promise<void> => {
    if (!roomId || !hasMore || isLoading || !cursorRef.current) return;

    setIsLoading(true);
    try {
      const response = await axiosClient.get<MessagesResponse>(
        `/messages/rooms/${roomId}/messages`,
        { params: { cursor: cursorRef.current } }
      );

      setMessages((prev) => [...response.data.messages, ...prev]);
      setHasMore(response.data.hasMore);
      cursorRef.current = response.data.nextCursor;
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, hasMore, isLoading]);

  const sendMessage = useCallback(
    (content: string, type: MessageType = MessageType.TEXT): void => {
      if (!socket || !roomId || !content.trim()) return;

      socket.emit(SocketEvent.SEND_MESSAGE, {
        roomId,
        content: content.trim(),
        type,
      });
    },
    [socket, roomId]
  );

  const startTyping = useCallback((): void => {
    if (!socket || !roomId) return;
    socket.emit(SocketEvent.TYPING_START, { roomId });
  }, [socket, roomId]);

  const stopTyping = useCallback((): void => {
    if (!socket || !roomId) return;
    socket.emit(SocketEvent.TYPING_STOP, { roomId });
  }, [socket, roomId]);

  const markAsRead = useCallback(
    (messageId: string): void => {
      if (!socket || !roomId) return;
      socket.emit(SocketEvent.MARK_READ, { roomId, messageId });
    },
    [socket, roomId]
  );

  return {
    messages,
    isLoading,
    hasMore,
    typingUsers,
    sendMessage,
    loadMoreMessages,
    startTyping,
    stopTyping,
    markAsRead,
  };
};
