'use client';
import React from 'react';
import data from '@/../public/lotties/pong.json';
import Lottie from 'react-lottie-player';

const Loading = () => {
  return (
    <div className="bg-[#161F1E] h-screen overflow-scroll flex flex-col justify-center items-center">
      <Lottie
        loop
        animationData={data}
        play
        style={{ height: 300, width: 300 }}
      />
    </div>
  );
};

export default Loading;
