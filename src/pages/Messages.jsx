import React from 'react'
import { ChatList, MessageInbox, SideBar } from '../section/chat'

function Messages() {
  return (
    <div className='h-screen overflow-hidden'>
      <div className='h-full rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex'>
        {/* Sidebar*/}
        <SideBar />
        {/* ChatList*/}
        <ChatList />
        {/* Inbox*/}
        <MessageInbox />

        
      </div>
    </div>
  )
}

export default Messages