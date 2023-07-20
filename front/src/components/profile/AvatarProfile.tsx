"use client";
import React from 'react';
import MyAvatar from './MyAvatar';

interface Props {
  position: string,
}

const AvatarProfile: React.FC<Props> = (style) => (
  <div className='relative flex items-center justify-center'>
    <div className={`absolute ${style.position} w-[100px] h-[100px]`} >
      <MyAvatar/>
    </div>
  </div>
);

export default AvatarProfile;