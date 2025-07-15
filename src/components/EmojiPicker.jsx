import React, { useEffect, useRef, useState } from 'react';
import { SmileyIcon } from '@phosphor-icons/react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

function EmojiPicker({ onSelect }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const colorMode = JSON.parse(window.localStorage.getItem('color-theme'));
    const handleTrigger = (e) => {
        e.preventDefault();
        setPickerOpen((prev) => !prev);
    };

    const pickerref = useRef(null);
    const buttonref = useRef(null);

    const handleEmojiSelect = (emoji) => {
        if (onSelect) {
            onSelect(emoji);
        }
        setPickerOpen(false); // close picker after selection
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerref.current && !pickerref.current.contains(e.target) && buttonref.current && !buttonref.current.contains(e.target)) {
                setPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])
    return (
        <div className="relative flex items-center">
            <button
                ref={buttonref}
                type="button"
                className="hover:text-primary cursor-pointer text-gray-600 dark:text-gray-300"
                onClick={handleTrigger}
            >
                <SmileyIcon size={24} />
            </button>

            {pickerOpen && (
                <div ref={pickerref} className="absolute bottom-full right-0 z-50">
                    <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme={colorMode}
                    />
                </div>
            )}
        </div>
    );
}

export default EmojiPicker;
