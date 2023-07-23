"use client"
import React from 'react'
import FriendCard from './FriendCard';

const Friend = () => {
  return (
    <div className='bg-[#243230] rounded-[5px] text-white min-h-[200px] 
            max-h-[40vh] lg:max-h-[56vh] md:max-h-[56vh] xl:max-h-[56vh] 2xl:max-h-[56vh]
            flex flex-col items-center px-2 overflow-y-auto overflow-x-hidden m-2 mt-5'>
      <FriendCard />
      <FriendCard />
      <FriendCard />
    </div>
  )
}

export default Friend