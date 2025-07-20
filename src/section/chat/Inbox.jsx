import React, { useState } from 'react'

import user01 from './../../images/user/user-01.png'
import { DotsThreeIcon, GifIcon, LinkSimpleIcon, MicrophoneIcon, PaperPlaneTiltIcon, PhoneCallIcon, SmileyIcon, VideoCameraIcon } from '@phosphor-icons/react'
import Dropdown from '../../components/Dropdown'
import EmojiPicker from '../../components/EmojiPicker'
import UserInfo from './UserInfo'
import Giphy from '../../components/Giphy'
import { useDispatch } from 'react-redux'
import { ToggleAudioModal, ToggleMediaModal } from '../../redux/slices/app'
import Attachment from '../../components/Attachment'
import MsgSeprator from '../../components/MsgSeprator'
import TypingIndicator from '../../components/TypingIndicator'
import { TextMessage } from '../../components/Messages'

function Inbox() {
    const dispatch = useDispatch();
    const [userInfoOpen, setUserInfo ] = useState(false);
    const [gifOpen, setGifOpen]=useState(false);

    const handleToggleGifOpen = (e)=>{
         e.preventDefault();
        setGifOpen((prev)=>!prev)
    }
    const handleToggleUserInfo = ()=>{
       
        setUserInfo((prev)=>!prev);
    }
    const handleToggleVoiceOpen = (e)=>{
        e.preventDefault();
        dispatch(ToggleAudioModal(true))
    }
    return (
        <>
        <div className={`flex h-full flex-col border-l border-stroke dark:border-strokedark ${userInfoOpen ? "xl:w-1/2" : "xl:w-3/4"}`}>
            <div className='sticky flex items-center flex-row justify-between border-b border-stroke dark:border-strokedark px-6 py-4.5'>
                 <div className='flex items-center '>
                    <div className='mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full'>
                        <img src={user01} alt="avatar" className='h-full w-full object-cover object-center cursor-pointer' onClick={handleToggleUserInfo}/>
                    </div>

                    <div>
                        <h5 className='font-medium text-black dark:text-white'>
                            Hello Dholi
                        </h5>
                        <p className='text-sm '>Reply to message </p>
                    </div>
                </div>
                <div className='flex flex-row items-center space-x-8'>
                    <button>
                        <VideoCameraIcon size={24}/>
                    </button>
                    <button>
                        <PhoneCallIcon size={24}/>
                    </button>
                    <Dropdown />
                </div>
            </div>


            {/* List of messsages */}
            <div className='max-h-full space-y-3.5 overflow-auto no-scrollbar px-6 py-7.5 grow'>
                

                <div className='max-w-125 ml-auto'>
                    {/* <p className='mb-2.5 text-sm font-medium'>Andri Thomas</p> */}
                    <div className='mb-2.5 rounded-2xl rounded-br-none bg-primary px-5 py-3'>
                        <p className='text-white'>Hello I want to check the schedule and inform you</p>
                    </div>
                    <p className='text-xs'>1:57pm</p>
                </div>
                <TextMessage author="Prashast saxena" content="Hi there this is our first message https://www.youtube.com/ " read_receipt="sent" incoming={true} timestamp="2:44pm"/>
                <div className='max-w-125'>
                    <p className='mb-2.5 text-sm font-medium'>Andri Thomas</p>
                    <div className='mb-2.5 rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2'>
                        <p>I want to make an appointment tommorow from 2:00 PM to 5:00 PM</p>
                    </div>
                    <p className='text-xs'>1:55pm</p>
                </div>
                <MsgSeprator />
                <div className='max-w-125 ml-auto'>
                    {/* <p className='mb-2.5 text-sm font-medium'>Andri Thomas</p> */}
                    <div className='mb-2.5 rounded-2xl rounded-br-none bg-primary px-5 py-3'>
                        <p className='text-white'>Hello I want to check the schedule and inform you</p>
                    </div>
                    <p className='text-xs'>1:57pm</p>
                </div>
                <div className='max-w-125'>
                    <p className='mb-2.5 text-sm font-medium'>Andri Thomas</p>
                    <div className='mb-2.5 rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2'>
                        <p>I want to make an appointment tommorow from 2:00 PM to 5:00 PM</p>
                    </div>
                    <p className='text-xs'>1:55pm</p>
                </div>
                <div className='max-w-125 ml-auto'>
                    {/* <p className='mb-2.5 text-sm font-medium'>Andri Thomas</p> */}
                    <div className='mb-2.5 rounded-2xl rounded-br-none bg-primary px-5 py-3'>
                        <p className='text-white'>Hello I want to check the schedule and inform you</p>
                    </div>
                    <p className='text-xs'>1:57pm</p>
                </div>
                <div className='max-w-125'>
                    <p className='mb-2.5 text-sm font-medium'>Andri Thomas</p>
                    <div className='mb-2.5 rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2'>
                        <p>I want to make an appointment tommorow from 2:00 PM to 5:00 PM</p>
                    </div>
                    <p className='text-xs'>1:55pm</p>
                </div>
                <TypingIndicator /> 

            </div>
            {/* INput section */}
            <div className='sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark'>
                <form className='flex items-center justify-between space-x-4.5'>
                    <div className='relative w-full'>
                        <input type="text" placeholder='Type something here' className='h-12 w-full rounded-md border boreder-stroke bg-gray pl-5 pr-19 text-black placeholder-body oultine-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white' />

                        <div className='absolute right-5 top-1/2 -translate-y-1/2 items-center justify-end space-x-4'>
                            <button onClick={handleToggleVoiceOpen} className='hover:text-primary cursor-pointer'>
                               <MicrophoneIcon weight='bold' size={20}/>
                            </button>
                            <button className='hover:text-primary cursor-pointer'>
                                <Attachment />
                            </button>
                            <button className="hover:text-primary cursor-pointer" onClick={handleToggleGifOpen}>
                                <GifIcon size={20}/>
                            </button>
                            <button className='hover:text-primary cursor-pointer'>
                                <EmojiPicker />
                            </button>
                        </div>
                    </div>

                    <button className='flex items-center justify-center h-13  max-w-13 w-full rounded-md bg-primary text-white hover:bg-opacity-90 '>
                        <PaperPlaneTiltIcon weight='bold' size={24} />
                    </button>
                </form>

                {gifOpen && <Giphy />}
            </div>
        </div>

        {userInfoOpen && (<div className='w-1/4 '>
        <UserInfo handleToggleUserInfo={handleToggleUserInfo}/>
        </div>)}
        </>
    )
}

export default Inbox
