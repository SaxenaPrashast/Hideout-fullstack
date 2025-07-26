import React from 'react'
import UserOne from '../../images/user/user-01.png'
import { CameraIcon } from '@phosphor-icons/react'
function ProfileForm() {
  return (
    <div className='flex flex-col w-full p-4 space-y-6'>
        <div className='relative z-30 w-full rounded-full p-1 backdrop-blur sm:max-w-w-36 sm:p-3'>
            <div className='relative drop-shadow-2'>
                <img src={UserOne} alt="" className='rounded-full object-center object-cover' />
            </div>
            <label htmlFor="profile" className='absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-primary text-white hover:bg-opacity/90 sm:bottom-2 sm-right-2'>
            <CameraIcon size={20}/>
            </label>
        </div>
    </div>
  )
}

export default ProfileForm
