"use client";
import React from 'react';
import MyAvatar from './MyAvatar';

const AvatarProfile: React.FC = () => (
  <div className='relative flex '>
    <div className='absolute top-[-7vh] left-7 w-[100px] h-[100px]'>
      <MyAvatar/>
    </div>
  </div>
);

export default AvatarProfile;