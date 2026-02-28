import React, { useState } from 'react';
import { IRoom } from '../types';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ChatWindow } from '../components/Chat/ChatWindow';

export const ChatPage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleSelectRoom = (room: IRoom): void => {
    setSelectedRoom(room);
  };

  const handleBack = (): void => {
    setSelectedRoom(null);
  };

  return (
    <div className="h-screen flex bg-gray-900 overflow-hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-10 p-2 bg-gray-800 rounded-lg md:hidden"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar
        selectedRoom={selectedRoom}
        onSelectRoom={handleSelectRoom}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Chat Window */}
      <div className="flex-1 flex flex-col relative">
        <ChatWindow 
          room={selectedRoom} 
          onBack={handleBack}
        />
      </div>
    </div>
  );
};
