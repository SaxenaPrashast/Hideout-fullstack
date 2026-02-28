import React from 'react';
import { IUser } from '../../types';

interface OnlineUsersProps {
  users: IUser[];
  onSelectUser: (user: IUser) => void;
}

export const OnlineUsers: React.FC<OnlineUsersProps> = ({
  users,
  onSelectUser,
}) => {
  const onlineUsers = users.filter((u) => u.isOnline);
  const offlineUsers = users.filter((u) => !u.isOnline);

  const getInitials = (name: string | undefined): string => {
    if (!name) return '?';
    return name.slice(0, 2).toUpperCase();
  };

  const renderUser = (user: IUser): React.ReactNode => (
    <button
      key={user._id}
      onClick={() => onSelectUser(user)}
      className="w-full p-2 flex items-center gap-3 hover:bg-gray-700 rounded-lg transition"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium relative flex-shrink-0"
        style={{ backgroundColor: user.avatar || '#6366f1' }}
      >
        {getInitials(user.username)}
        {user.isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-gray-800 rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-medium text-white truncate">
          {user.username || 'Unknown'}
        </p>
        <p className="text-xs text-gray-500 truncate">{user.email || ''}</p>
      </div>
    </button>
  );

  return (
    <div className="p-3">
      {/* Online section */}
      {onlineUsers.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 px-2">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs font-medium text-gray-400 uppercase">
              Online — {onlineUsers.length}
            </span>
          </div>
          <div className="space-y-1">{onlineUsers.map(renderUser)}</div>
        </div>
      )}

      {/* Offline section */}
      {offlineUsers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 px-2">
            <span className="w-2 h-2 bg-gray-500 rounded-full" />
            <span className="text-xs font-medium text-gray-400 uppercase">
              Offline — {offlineUsers.length}
            </span>
          </div>
          <div className="space-y-1">{offlineUsers.map(renderUser)}</div>
        </div>
      )}

      {users.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-4">
          No other users yet
        </p>
      )}
    </div>
  );
};
