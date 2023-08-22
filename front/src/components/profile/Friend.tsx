'use client';
import React from 'react';
import FriendCard from './FriendCard';

const Friend = () => {
  return (
    <div className="bg-[#243230] rounded-md text-white flex flex-col p-2 xl:p-3 overflow-auto">
      <FriendCard username="mehdi" />
      <FriendCard username="mehdi" inGame />
      <FriendCard username="mehdi" online />
    </div>
  );
};

export default Friend;
