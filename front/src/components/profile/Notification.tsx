import Image from 'next/image'
import React, { FC, useState } from 'react'
import MyToast from '../ui/Toast/MyToast'

type NotificationProps = {
  name: string
  avatar: string
  message: string
} & ({
  isFriend?: true
  isOnline?: boolean
} | {
  isFriend?: false
  isOnline: never
})


const Notification: FC<NotificationProps> = ({ avatar, isFriend, isOnline, message, name }) => {


  return (
    <div className='bg-primary rounded-md p-2'>
      <div className='flex flex-col gap-1 lg:gap-2'>
        <div className='flex items-center'>
          <div className={`h-10 w-10 2xl:h-12 2xl:w-12 rounded-full border ${isOnline ? 'border-green-500' : 'border-gray-500'} relative p-4 mx-2 2xl:mx-4`}>
            {isFriend && <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'} absolute right-0 2xl:right-1 bottom-0 z-10`}></div>}
            <Image src={avatar} alt="" className='rounded-full' fill priority />
          </div>
          <h3 className='text-xs lg:text-sm tracking-wider'><strong className='text-secondary text-sm lg:text-base capitalize'>{name}</strong> {message}</h3>
        </div>
        <div className='flex gap-2 xl:gap-3 self-end text-xs md:text-sm '>
          <button  className='aaaa bg-secondary py-1 px-2 border border-secondary rounded-md text-black 
          hover:bg-transparent hover:text-secondary transition-all duration-150'>Accepte</button>
          <button className='bg-red-500 py-1 px-2 border border-red-500 rounded-md text-white 
          hover:bg-transparent hover:text-red-500 transition-all duration-150'>Deny</button>
        </div>
      </div>
    </div>
  )
}

export default Notification