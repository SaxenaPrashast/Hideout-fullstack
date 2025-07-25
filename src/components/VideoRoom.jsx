import { MicrophoneIcon, MicrophoneSlashIcon, PhoneDisconnectIcon, VideoCameraIcon, VideoCameraSlashIcon } from '@phosphor-icons/react'
import React, { useState } from 'react'
import User01 from '../images/user/user-01.png'
import User02 from '../images/user/user-02.png'

function VideoRoom({ open, handleClose }) {
    const [muteAudio, setMuteAudio] = useState(false);
    const [muteVideo, setMuteVideo] = useState(false);

    const handleToggleAudio = () => {
        setMuteAudio((p) => !p);
    }
    const handleToggleVideo = () => {
        setMuteVideo((p) => !p);
    }
    return (
        <div className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${open ? "block" : "hidden"}`}>
            <div className='w-full max-w-142.5 rounded-lg bg-white dark:bg-boxdark md:py-8 px-8 py-12'>

                <div className='flex flex-col space-y-6'>

                    {/* Video Feed Grid */}
                    <div className='grid grid-cols-2 gap-4 h-50 mb-4'>
                        {/* Video feed 1 */}
                        <div className='relative h-full w-full bg-gray dark:bg-boxdark-2 rounded-md flex items-center justify-center'>
                            <div className='space-y-2'>
                                <img src={User01} alt="" className='h-20 w-20 rounded-full object-center object-cover' />
                                <div className='font-medium text-sm text-center'>You</div>
                            </div>
                            <div className="absolute top-3 right-4">
                                {muteAudio && <MicrophoneSlashIcon size={20} className="text-primary"/>}
                            </div>
                        </div>

                        {/* Video feed 2 */}
                        <div className='relative h-full w-full bg-gray dark:bg-boxdark-2 rounded-md flex items-center justify-center'>
                            <div className='space-y-2'>
                                <img src={User02} alt="" className='h-20 w-20 rounded-full object-center object-cover' />
                                <div className='font-medium text-sm text-center'>Mona</div>
                            </div>
                            <div className="absolute top-3 right-4">
                                {<MicrophoneSlashIcon size={20} className="text-primary"/>}
                            </div>
                        </div>
                    </div>
                    {/* Call controls */}

                    <div className='flex flex-row items-center justify-center space-x-4'>
                        {/* Microphone Button */}
                        <button onClick={handleToggleAudio} className='p-3 rounded-md bg-gray dark:bg-boxdark text-black dark:text-white hover:bg-opacity-80 flex items-center justify-center'>
                            {muteAudio ? <MicrophoneSlashIcon size={20} /> : <MicrophoneIcon size={20} />}
                        </button>
                        {/* Disconnecting */}

                        <button onClick={handleClose} className='p-3 rounded-full bg-red text-white hover:bg-opaacity/90 cursor-pointer'>
                            <PhoneDisconnectIcon size={20} />
                        </button>
                        {/* Video Camera Button */}
                        <button onClick={handleToggleVideo} className='p-3 rounded-md bg-gray dark:bg-boxdark text-black dark:text-white hover:bg-opacity-80 flex items-center justify-center'>
                            {muteVideo ? <VideoCameraSlashIcon size={20} /> : <VideoCameraIcon size={20} />}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default VideoRoom
