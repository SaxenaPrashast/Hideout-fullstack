import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToggleAudioModal } from '../redux/slices/app';
import { ReactMediaRecorder } from "react-media-recorder";
import { MicrophoneIcon } from '@phosphor-icons/react';

function VoiceRecorder() {
    const modalRef = useRef(null);
    const { audio } = useSelector((state) => state.app.modals);
    const dispatch = useDispatch();
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!audio || keyCode !== 27) return;
            dispatch(ToggleAudioModal(false));
        };

        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    }, [audio, dispatch]);

    return (
        <div className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${audio ? "block" : "hidden"}`}>
            <div ref={modalRef} className='md:px-17.5 w-full max-w-142.5 rounded-lg bg-white dark:bg-boxdark md:py-8 px-8 py-12 '>
                <div className='flex flex-col space-y-8 items-center '>
                    {audio && (
                        <ReactMediaRecorder
                            key={audio}
                            audio
                            render={({ status, startRecording, stopRecording, mediaBlobUrl }) => {
                                const handleToggle = () => {
                                    if (!isRecording) {
                                        startRecording();
                                        setIsRecording(true);
                                    } else {
                                        stopRecording();
                                        setIsRecording(false);
                                    }
                                };
                                return (
                                    <div className="flex flex-col items-center space-y-4">
                                        <button
                                            onClick={handleToggle}
                                            className={`${isRecording ? 'bg-red-600' : 'bg-blue-600'} px-4 py-2 text-white rounded-full shadow-lg`}
                                        >
                                            <MicrophoneIcon size={30} />
                                        </button>

                                        {mediaBlobUrl && (
                                            <audio src={mediaBlobUrl} controls className="mt-4" />
                                        )}
                                    </div>
                                );
                            }}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}

export default VoiceRecorder;