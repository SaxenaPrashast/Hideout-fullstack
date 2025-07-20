import { File, ImageIcon, PaperclipIcon} from '@phosphor-icons/react'
import React, { useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { ToggleDocumentModal, ToggleMediaModal } from '../redux/slices/app';

function Attachment() {
    const [dropdownOpen, setdropdownOpen] = useState(false);
    const trigger = useRef(null);
    const dropdown = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownOpen &&
                dropdown.current &&
                !dropdown.current.contains(e.target) &&
                !trigger.current.contains(e.target)
            ) {
                setdropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <div className='relative flex'>
            <button
                ref={trigger}
                className='text-[#98A6AD] hover:text-primary'
                onClick={(e) => {
                    e.preventDefault();
                    setdropdownOpen((prev) => !prev)}}
            >
                <PaperclipIcon weight='bold' size={20}/>
            </button>

            <div
                ref={dropdown}
                className={`absolute right-0 -top-24 z-40 w-54 space-y-1 rounded-sm border-stroke bg-white p-1.5 shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen ? 'block' : 'hidden'}`}
            >
                <button onClick={(e)=>{
                    e.preventDefault();
                    dispatch(ToggleMediaModal(true));
                }} className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
                    <ImageIcon size={24} />
                    Images and Videos
                </button>

                <button onClick={(e)=>{
                    e.preventDefault();
                    dispatch(ToggleDocumentModal(true))
                }} className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
                    <File size={24} />
                    Files and Documents
                </button>
            </div>
        </div>
    )
}

export default Attachment
