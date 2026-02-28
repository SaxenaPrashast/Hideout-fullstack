import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { IRoom, IUser } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { RoomList } from './RoomList';
import { OnlineUsers } from './OnlineUsers';

interface SidebarProps {
  selectedRoom: IRoom | null;
  onSelectRoom: (room: IRoom) => void;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'chats' | 'users';

export const Sidebar: React.FC<SidebarProps> = ({
  selectedRoom,
  onSelectRoom,
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const { isConnected, onlineUsers } = useSocket();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch rooms and users
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const [roomsRes, usersRes] = await Promise.all([
          axiosClient.get<IRoom[]>('/messages/rooms'),
          axiosClient.get<IUser[]>('/messages/users'),
        ]);
        setRooms(roomsRes.data);
        // Filter out any users with missing required fields
        const validUsers = usersRes.data.filter(
          (u) => u && u._id && u.username && u.email
        );
        setUsers(validUsers);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update user online status from socket
  useEffect(() => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => ({
        ...u,
        isOnline: onlineUsers.has(u._id),
      }))
    );
  }, [onlineUsers]);

  // Handle starting a DM with a user
  const handleSelectUser = async (selectedUser: IUser): Promise<void> => {
    try {
      const response = await axiosClient.post<IRoom>('/messages/rooms', {
        memberId: selectedUser._id,
      });
      const room = response.data;

      // Add room to list if not already present
      setRooms((prev) => {
        const exists = prev.some((r) => r._id === room._id);
        if (exists) return prev;
        return [room, ...prev];
      });

      onSelectRoom(room);
      setActiveTab('chats');
      onClose();
    } catch (error) {
      console.error('Failed to create/get DM room:', error);
    }
  };

  // Handle room selection
  const handleSelectRoom = (room: IRoom): void => {
    onSelectRoom(room);
    onClose();
  };

  const getInitials = (name: string): string => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-30 w-[280px] bg-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* User profile header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium relative"
              style={{ backgroundColor: user?.avatar || '#6366f1' }}
            >
              {user ? getInitials(user.username) : '?'}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-gray-800 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-gray-500'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-white truncate">
                {user?.username}
              </h2>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
              title="Logout"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === 'chats'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === 'users'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Users
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <svg
                className="animate-spin h-6 w-6 text-indigo-500"
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
          ) : activeTab === 'chats' ? (
            <RoomList
              rooms={rooms}
              selectedRoomId={selectedRoom?._id || null}
              onSelectRoom={handleSelectRoom}
            />
          ) : (
            <OnlineUsers users={users} onSelectUser={handleSelectUser} />
          )}
        </div>

        {/* Online count footer */}
        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span>
              {users.filter((u) => u.isOnline).length} users online
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
