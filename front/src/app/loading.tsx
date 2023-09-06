'use client';
import React from 'react';
import Lottie from 'react-lottie';
import data from '@/../public/lotties/pong.json';

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: data,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="bg-[#161F1E] h-screen overflow-scroll flex flex-col justify-center items-center">
      <Lottie options={defaultOptions} height={300} width={300} />
    </div>
  );
};

export default Loading;
