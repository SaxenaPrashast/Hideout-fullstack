import React from 'react'
import { ChatList, MessageInbox, SideBar } from '../section/chat'
import GifModal from '../components/GifModal'
import VoiceRecorder from '../components/VoiceRecorder'
import MediaPicker from '../components/MediaPicker'

function Messages() {
  return (
    <div className='h-screen overflow-hidden '>
      <div className='h-full rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex'>
        {/* Sidebar*/}
        <SideBar />
        {/* ChatList*/}
        <ChatList />
        {/* Inbox*/}
        <MessageInbox />
      </div>
      <GifModal />
      <VoiceRecorder/>
      <MediaPicker />
    </div>
  )
}

export default Messages