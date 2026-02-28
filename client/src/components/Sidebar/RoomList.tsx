import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { IRoom } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface RoomListProps {
  rooms: IRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (room: IRoom) => void;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  selectedRoomId,
  onSelectRoom,
}) => {
  const { user } = useAuth();

  const getRoomDisplayName = (room: IRoom): string => {
    if (room.isGroup) return room.name;
    const otherMember = room.members.find((m) => m._id !== user?._id);
    return otherMember?.username || 'Unknown User';
  };

  const getRoomAvatar = (room: IRoom): { color: string; initials: string } => {
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

  const isOtherUserOnline = (room: IRoom): boolean => {
    if (room.isGroup) return false;
    const otherMember = room.members.find((m) => m._id !== user?._id);
    return otherMember?.isOnline || false;
  };

  const formatLastMessageTime = (date: string): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: false });
  };

  if (rooms.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No conversations yet</p>
        <p className="text-sm mt-1">Start a new chat below</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {rooms.map((room) => {
        const avatar = getRoomAvatar(room);
        const isSelected = selectedRoomId === room._id;

        return (
          <button
            key={room._id}
            onClick={() => onSelectRoom(room)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-gray-700 transition ${
              isSelected ? 'bg-gray-700' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium relative flex-shrink-0"
              style={{ backgroundColor: avatar.color }}
            >
              {avatar.initials}
              {!room.isGroup && isOtherUserOnline(room) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full" />
              )}
            </div>

            {/* Room info */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white truncate">
                  {getRoomDisplayName(room)}
                </h3>
                {room.lastMessage && (
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatLastMessageTime(room.lastMessage.createdAt)}
                  </span>
                )}
              </div>
              {room.lastMessage && (
                <p className="text-sm text-gray-400 truncate">
                  {room.lastMessage.sender._id === user?._id ? 'You: ' : ''}
                  {room.lastMessage.content}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
