import { DotsThreeIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import React, { useRef, useState, useEffect } from 'react'

function Dropdown() {
    const [dropdownOpen, setdropdownOpen] = useState(false);
    const trigger = useRef(null);
    const dropdown = useRef(null);

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
                className='text-[#98A6AD] hover:text-body'
                onClick={() => setdropdownOpen((prev) => !prev)}
            >
                <DotsThreeIcon size={24} />
            </button>

            <div
                ref={dropdown}
                className={`absolute right-0 top-full z-40 w-40 space-y-1 rounded-sm border-stroke bg-white p-1.5 shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen ? 'block' : 'hidden'}`}
            >
                <button className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
                    <PencilSimpleIcon size={20} />
                    Edit
                </button>

                <button className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
                    <TrashIcon size={20} />
                    Delete
                </button>
            </div>
        </div>
    )
}

export default Dropdown
