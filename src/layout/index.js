import React, { useState } from 'react'
import { ChatIcon, DotsThreeCircleIcon, ShapesIcon, SignOutIcon, UserCheckIcon, UsersIcon } from '@phosphor-icons/react'
import DarkModeSwitcher from '../components/DarkModeSwitcher';


const Navigation = [
  {
    key: 0,
    title: "DMs",
    icon: <ChatIcon size={24} />,
  },
  {
    key: 1,
    title: "Groups",
    icon: <UsersIcon size={24} />
  },
  {
    key: 2,
    title: "Profiles",
    icon: <UserCheckIcon size={24} />
  },
  {
    key: 3,
    title: "More",
    icon: <DotsThreeCircleIcon size={24} />
  },
];

function SideBar() {
  const [selected, setSelected] = useState(0);
  const handleclick = (key) => {
    setSelected(key);
  }
  return (
    <div className='flex flex-col border-r border-stroke p-2 dark:border-r-strokedark'>
      {/* <div className='mx-auto border-2 rounded-md p-2 dark:border-strokedark'>
        <ChatIcon size={24} />
      </div> */}

      <div className='flex flex-col items-center space-y-5'>
        <div className='space-y-2 flex flex-col text-center'>
          <div className='mx-auto border-2 rounded-md p-2 dark:border-strokedark'>
            <ShapesIcon size={24} />
          </div>
          <span className='font-medium text-sm '>Workspace</span>
        </div>
        {Navigation.map(({ icon, key, title }) => <div key={key} className='space-y-2 flex flex-col text-center hover:cursor-pointer hover:text-primary' onClick={() => { handleclick(key) }}>
          <div className='space-y-2 flex flex-col text-center'>
            <div className={`mx-auto border-2 rounded-md p-2 dark:border-strokedark ${selected === key && "bg-primary bg-opacity-90 text-white"} hover:border-primary dark:hover:border-primary"`}>
              {icon}
            </div>
            <span className={`font-medium text-sm ${selected === key && "text-primary"}`}>{title}</span>
          </div>
        </div>)}
      </div>
      <div className='flex flex-col grow '></div>
      <div className="space-y-2">
        <div className='flex flex-row items-center justify-center'>
        <DarkModeSwitcher />
        </div>
        <div className='flex flex-row items-center justify-center border-2 rounded-md p-2 dark:border-strokedark hover:bg-stone-200 hover:cursor-pointer'>
          <SignOutIcon size={24} />

        </div>

      </div>
    </div>
  )
}

export default SideBar
