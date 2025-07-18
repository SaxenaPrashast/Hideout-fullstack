import React, { useEffect, useRef, useState } from 'react';
import { SmileyIcon } from '@phosphor-icons/react';
import EmojiPickerLib from 'emoji-picker-react';

function EmojiPicker({ onSelect }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const colorMode = JSON.parse(window.localStorage.getItem('color-theme')) || 'light';

    const pickerRef = useRef(null);
    const buttonRef = useRef(null);

    const handleTrigger = (e) => {
        e.preventDefault();
        setPickerOpen((prev) => !prev);
    };

    const handleEmojiSelect = (emojiData) => {
        if (onSelect) {
            onSelect(emojiData.emoji);
        }
        setPickerOpen(false); // close picker after selection
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex items-center">
            <button
                ref={buttonRef}
                type="button"
                className="hover:text-primary cursor-pointer text-gray-600 dark:text-gray-300"
                onClick={handleTrigger}
            >
                <SmileyIcon size={24} />
            </button>

            {pickerOpen && (
                <div ref={pickerRef} className="absolute bottom-full right-0 z-50">
                    <EmojiPickerLib
                        onEmojiClick={(_, emojiObject) => handleEmojiSelect(emojiObject)}
                        theme={colorMode === 'dark' ? 'dark' : 'light'}
                        height={350}
                        width={300}
                    />
                </div>
            )}
        </div>
    );
}

export default EmojiPicker;
