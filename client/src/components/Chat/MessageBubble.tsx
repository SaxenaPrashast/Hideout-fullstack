import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { IMessage } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface MessageBubbleProps {
  message: IMessage;
  showAvatar: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showAvatar,
}) => {
  const { user } = useAuth();
  const isSent = message.sender._id === user?._id;

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: string): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div
      className={`flex items-end gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'} ${
        showAvatar ? 'mb-4' : 'mb-1'
      }`}
    >
      {/* Avatar */}
      {showAvatar ? (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium text-white"
          style={{ backgroundColor: message.sender.avatar || '#6366f1' }}
        >
          {getInitials(message.sender.username)}
        </div>
      ) : (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Message content */}
      <div className={`max-w-[70%] ${isSent ? 'items-end' : 'items-start'}`}>
        {showAvatar && !isSent && (
          <p className="text-xs text-gray-400 mb-1 ml-1">
            {message.sender.username}
          </p>
        )}
        <div
          className={`px-4 py-2 ${
            isSent
              ? 'bg-indigo-600 rounded-tl-2xl rounded-b-2xl'
              : 'bg-gray-700 rounded-tr-2xl rounded-b-2xl'
          }`}
        >
          <p className="text-white text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        {showAvatar && (
          <p className={`text-xs text-gray-500 mt-1 ${isSent ? 'text-right mr-1' : 'ml-1'}`}>
            {formatTime(message.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
};
