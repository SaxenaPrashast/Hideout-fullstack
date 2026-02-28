import React, { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
}) => {
  const [message, setMessage] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isTypingRef = useRef<boolean>(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: FormEvent<HTMLFormElement>): void => {
    e?.preventDefault();
    
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
    isTypingRef.current = false;
    onTypingStop();

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value;
    setMessage(value);

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }

    // Handle typing indicator
    if (value.trim() && !isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart();
    } else if (!value.trim() && isTypingRef.current) {
      isTypingRef.current = false;
      onTypingStop();
    }
  };

  return (
    <div className="border-t border-gray-700 bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition disabled:opacity-50"
            style={{ maxHeight: '120px' }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full transition duration-200 flex-shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
