import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToggleAudioModal } from '../redux/slices/app';
import { ReactMediaRecorder } from "react-media-recorder";
import { MicrophoneIcon, Pause, Play, X } from '@phosphor-icons/react';

function VoiceRecorder() {
    const modalRef = useRef(null);
    const { audio } = useSelector((state) => state.app.modals);
    const dispatch = useDispatch();
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

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
            <div ref={modalRef} className='md:px-17.5 w-full max-w-142.5 rounded-lg bg-white dark:bg-boxdark md:py-8 px-8 py-12'>
                <div className='flex flex-col space-y-8 items-center'>
                    {audio && (
                        <ReactMediaRecorder
                            key={audio}
                            audio
                            render={({
                                startRecording,
                                stopRecording,
                                pauseRecording,
                                resumeRecording,
                                mediaBlobUrl,
                            }) => {
                                const handleStartStop = () => {
                                    if (!isRecording) {
                                        startRecording();
                                        setIsRecording(true);
                                    } else {
                                        stopRecording();
                                        setIsRecording(false);
                                        setIsPaused(false);
                                    }
                                };

                                const handlePauseResume = () => {
                                    if (isPaused) {
                                        resumeRecording();
                                        setIsPaused(false);
                                    } else {
                                        pauseRecording();
                                        setIsPaused(true);
                                    }
                                };

                                return (
                                    <div className="flex flex-col items-center space-y-4">
                                        {/* <video
                                            autoPlay
                                            muted
                                            ref={(video) => {
                                                if (video && previewStream) {
                                                    video.srcObject = previewStream;
                                                }
                                            }}
                                            className="w-48 h-16 rounded-md bg-black"
                                        /> */}

                                        <div className="flex space-x-4">
                                            <button
                                                onClick={handleStartStop}
                                                className={`${isRecording ? 'bg-red-600' : 'bg-primary'} px-4 py-2 text-white rounded-full shadow-md hover:cursor-pointer`}
                                            >
                                                {isRecording ? <X size={24} /> : <MicrophoneIcon size={24} />}
                                            </button>

                                            {isRecording && (
                                                <button
                                                    onClick={handlePauseResume}
                                                    className={` ${isPaused ? 'bg-yellow-500' : 'bg-blue-500'} px-4 py-2 text-white hover:cursor-pointer rounded-full shadow-md`}
                                                >
                                                    {isPaused ? <Play size={24} /> : <Pause size={24} />}
                                                </button>
                                            )}
                                        </div>

                                        {mediaBlobUrl && (
                                            <audio src={mediaBlobUrl} controls className="mt-4" />
                                        )}

                                        <div className='flex flex-row items-center space-x-4 w-full mt-8'>
                                            <button className={` ${ isRecording } not-visited:w-full bg-primary rounded-lg p-2 text-white hover:bg-opacity-90 hover:cursor-pointer`}>Send</button>
                                            <button onClick={()=>{
                                                dispatch(ToggleAudioModal(false))
                                            }} className={` not-visited:w-full bg-red rounded-lg p-2 text-white hover:bg-opacity-90 hover:cursor-pointer`}>Cancel</button>
                                        </div>
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
