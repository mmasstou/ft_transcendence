'use client';
import Lottie from 'react-lottie';
import data from '@/../public/lotties/404.json';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: data,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <>
      <main
        className="bg-[#161F1E] h-screen overflow-scroll 
      flex flex-col justify-center items-center text-white gap-2"
      >
        <div className="w-[80%] md:max-w-[50%] flex flex-col justify-center items-center">
          <Lottie options={defaultOptions} />

        </div>
      </main>
    </>
  );
};

export default NotFound;
