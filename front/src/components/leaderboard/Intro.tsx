import React from 'react';
import leader from '@/../public/leaderboerd.svg';
import trophy from '@/../public/trophy.svg';
import Image from 'next/image';

const Intro = () => {
  return (
    <div
      className=" flex flex-col justify-start 
              md:flex-row md:justify-center"
    >
      <div
        className="flex flex-col justify-start items-center rounded-[15px] mx-5 md:mx-10 md:w-[90%]
                 md:bg-[#3E504D] md:flex-row md:justify-between md:gap-10 md:h-[40vh] md:my-9"
      >
        <div className="md:w-1/2">
          <Image
            src={leader}
            width={350}
            height={700}
            alt="leaderboard icon"
            priority
          />
        </div>
        <div className="flex flex-col gap-4 mx-4 md:w-1/2">
          <div className="flex gap-2 justify-center">
            <h1 className="text-[2em] md:text-[2.5em] font-bold">
              Leaderboard
            </h1>
            <Image
              className="h-[40px] md:h-[45px]"
              src={trophy}
              width={45}
              height={45}
              alt="trophy icon"
              priority
            />
          </div>
          <p className="text-[1em] md:text-[1.2em] text-[#D9D9D9] font-semibold leading-8">
            Find all the results and score of your friends and the whole
            community. Your turn! Become the first!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
