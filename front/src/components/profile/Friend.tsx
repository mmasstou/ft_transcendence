'use client';
import React from 'react';
import FriendCard from './FriendCard';

const Friend = () => {
  return (
    <div className="bg-[#243230] rounded-md text-white flex flex-col p-2 xl:p-3 overflow-auto">
      <FriendCard username="mehdi" avatar={''} userId={''} socket={undefined} mode={''} />
      <FriendCard username="mehdi" inGame avatar={''} userId={''} socket={undefined} mode={''} />
      <FriendCard username="mehdi" online avatar={''} userId={''} socket={undefined} mode={''} />
    </div>
  );
};

export default Friend;
