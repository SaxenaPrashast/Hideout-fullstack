import React, { useState } from 'react'
import { ChatIcon, ChatTeardropTextIcon, ShapesIcon, SignOutIcon, UserCheckIcon} from '@phosphor-icons/react'
import DarkModeSwitcher from '../components/DarkModeSwitcher'
import { useNavigate } from 'react-router-dom';

const Navigation = [
  {
    key: 0,
    title: "DMs",
    icon: <ChatIcon size={24} />,
    path : "/dashboard"
  },
  {
    key: 1,
    title: "Profiles",
    icon: <UserCheckIcon size={24} />,
    path : "/dashboard/profile"
  },
];

function Layout() {
    const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const handleclick = (key) => {
    navigate(Navigation[key].path);
    setSelected(key);
  }
  return (
    <div className='flex flex-col border-r border-stroke p-2 dark:border-r-strokedark'>

      <div className='flex flex-col items-center space-y-5'>
        {/* <div className='space-y-2 flex flex-col text-center'>
          <div className='mx-auto border-2 rounded-md p-2 dark:border-strokedark'>
            <ShapesIcon size={24} />
          </div>
          <span className='font-medium text-sm '>Workspace</span>
        </div> */}
        <ChatTeardropTextIcon size={32} weight='bold' className='text-primary'/>
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
        <button onClick={()=>{
            navigate("/")
        }} className='flex flex-row items-center justify-center border-2 rounded-md p-2 dark:border-strokedark hover:bg-stone-200 hover:cursor-pointer'>
          <SignOutIcon size={24} />

        </button>

      </div>
    </div>
  )
}

export default Layout
