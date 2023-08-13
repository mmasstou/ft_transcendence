'use client';
import React from 'react';
import FriendCard from './FriendCard';

const Friend = () => {
  return (
    <div
      className="bg-[#243230] rounded-[5px] text-white flex flex-col items-center 
            px-2  m-2 mt-5 max-h-[30vh] overflow-y-scroll"
    >
      <FriendCard />
      <FriendCard />
      <FriendCard />
    </div>
  );
};

export default Friend;
