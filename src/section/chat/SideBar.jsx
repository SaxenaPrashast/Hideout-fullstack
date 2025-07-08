import React from 'react'
import { ChatIcon, SignOutIcon } from '@phosphor-icons/react'
import DarkModeSwitcher from '../../components/DarkModeSwitcher'

function SideBar() {
  return (
    <div className='flex flex-col border-r border-stroke p-2 dark:border-r-strokedark'>
      <div className='mx-auto border-2 rounded-md p-2 dark:border-strokedark'>
        <ChatIcon size={24} />
      </div>
      <div className='flex flex-col grow '></div>
      <div className="space-y-2">
        <DarkModeSwitcher />
        <div className='mx-auto border-2 rounded-md p-2 dark:border-strokedark hover:bg-stone-200 hover:cursor-pointer'>
          <SignOutIcon size={24} />

        </div>

      </div>
    </div>
  )
}

export default SideBar
