'use client';
import React from 'react';
import MyAvatar from './MyAvatar';

interface Props {
  position: string;
  score: string;
}

const AvatarProfile: React.FC<Props> = (style) => (
  <div className="relative flex items-center justify-center">
    <div className={`absolute ${style.position}`}>
      <MyAvatar />
      <div className="bottom-1 absolute">
        <span
          className={`bg-secondary flex justify-center items-center
                rounded-full text-[#161F1E] ${style.score}`}
        >
          18
        </span>
      </div>
    </div>
  </div>
);

export default AvatarProfile;
