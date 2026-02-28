import React, { useEffect, useRef, useState } from 'react';
import { IRoom, IMessage } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';

interface ChatWindowProps {
  room: IRoom | null;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ room, onBack }) => {
  const { user } = useAuth();
  const {
    messages,
    isLoading,
    hasMore,
    typingUsers,
    sendMessage,
    loadMoreMessages,
    startTyping,
    stopTyping,
  } = useMessages(room?._id || null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle scroll events
  const handleScroll = (): void => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;

    // Show scroll button if not at bottom
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isAtBottom);

    // Load more messages when scrolled to top
    if (scrollTop === 0 && hasMore && !isLoading) {
      loadMoreMessages();
    }
  };

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group consecutive messages by the same sender
  const shouldShowAvatar = (message: IMessage, index: number): boolean => {
    if (index === messages.length - 1) return true;
    const nextMessage = messages[index + 1];
    return (
      nextMessage.sender._id !== message.sender._id ||
      new Date(nextMessage.createdAt).getTime() -
        new Date(message.createdAt).getTime() >
        5 * 60 * 1000 // 5 minutes gap
    );
  };

  // Get room display name
  const getRoomName = (): string => {
    if (!room) return '';
    if (room.isGroup) return room.name;

    const otherMember = room.members.find((m) => m._id !== user?._id);
    return otherMember?.username || 'Unknown User';
  };

  // Get room avatar/initials
  const getRoomAvatar = (): { color: string; initials: string } => {
    if (!room) return { color: '#6366f1', initials: '?' };

    if (room.isGroup) {
      return {
        color: '#22c55e',
        initials: room.name.slice(0, 2).toUpperCase(),
      };
    }

    const otherMember = room.members.find((m) => m._id !== user?._id);
    return {
      color: otherMember?.avatar || '#6366f1',
      initials: otherMember?.username.slice(0, 2).toUpperCase() || '?',
    };
  };

  // Check if other user is online (for DM rooms)
  const isOtherUserOnline = (): boolean => {
    if (!room || room.isGroup) return false;
    const otherMember = room.members.find((m) => m._id !== user?._id);
    return otherMember?.isOnline || false;
  };

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-400">
            Select a conversation
          </h3>
          <p className="text-gray-500 mt-2">
            Choose a room from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  const avatar = getRoomAvatar();

  return (
    <div className="flex-1 flex flex-col bg-gray-900 h-full">
      {/* Header */}
      <div className="h-16 px-4 flex items-center gap-3 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm relative"
          style={{ backgroundColor: avatar.color }}
        >
          {avatar.initials}
          {!room.isGroup && isOtherUserOnline() && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-white">{getRoomName()}</h2>
          <p className="text-xs text-gray-400">
            {room.isGroup
              ? `${room.members.length} members`
              : isOtherUserOnline()
              ? 'Online'
              : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {isLoading && messages.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        {hasMore && messages.length > 0 && (
          <div className="text-center py-2">
            <button
              onClick={loadMoreMessages}
              disabled={isLoading}
              className="text-sm text-indigo-400 hover:text-indigo-300 disabled:text-gray-500"
            >
              {isLoading ? 'Loading...' : 'Load more messages'}
            </button>
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={message._id}
            message={message}
            showAvatar={shouldShowAvatar(message, index)}
          />
        ))}

        <TypingIndicator typingUsers={typingUsers} />
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 p-2 bg-gray-700 hover:bg-gray-600 rounded-full shadow-lg transition"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={sendMessage}
        onTypingStart={startTyping}
        onTypingStop={stopTyping}
      />
    </div>
  );
};
