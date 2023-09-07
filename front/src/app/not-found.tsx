'use client';
import Lottie from 'react-lottie-player';
import data from '@/../public/lotties/404.json';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <>
      <main
        className="bg-[#161F1E] h-screen overflow-scroll 
      flex flex-col justify-center items-center text-white gap-2"
      >
        <div className="w-[80%] md:max-w-[50%] flex flex-col justify-center items-center">
          <Lottie loop animationData={data} play />
        </div>
      </main>
    </>
  );
};

export default NotFound;
