"use client"
import React, { useRef, useEffect, createContext } from 'react';
import Dashboard from '../Dashboard';
import CanvasGame from '@/components/game/CanvasGame'; 
import Image from 'next/image';
import Link from 'next/link';
//<CanvasGame/>
const page = () => {
  return (
    <Dashboard>
      {/* <div className="w-full flex flex-col gap-10 items-center p-4 text-left tracking-wide">
        <h1 className="text-2xl xl:text-4xl 2xl:text-5xl font-bold">
          Game Play
        </h1>
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:mt-8 w-full items-center justify-center px-4">
          <div className="flex flex-col w-full items-center gap-4 lg:gap-10 xl:gap-16 leading-relaxed lg:text-lg xl:text-xl">
            <p>
              Welcome to our ping pong play page! Get ready to experience the
              thrill of virtual ping pong right from the comfort of your own
              device. Whether you're a casual player or a ping pong pro, this is
              the perfect place to showcase your skills and have a blast.
            </p>
            <p>
              To start playing, simply choose your preferred game mode. Are you
              up for a quick practice session to warm up? Select the "Practice
              Mode" and hone your techniques against our responsive AI
              opponents. Want to challenge friends ? Click on "Multiplayer Mode"
              to enter our vibrant community and engage in exhilarating matches.
            </p>
            <div className="flex gap-10 my-4 w-full justify-center">
              <Link
                href={'/game/modes'}
                className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2 border-yellow-500 rounded-xl font-bold text-yellow-500"
              >
                Time Mode
              </Link>
              <Link
                href={'/game/modes'}
                className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2  border-secondary rounded-xl font-bold text-secondary focus:outline-none"
              >
                Score Mode
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] xl:h-[600px] w-full">
            <Image fill src="/game-play 1.svg" alt="game-play" className="" />
          </div>
        </div>
      </div> */}
      <CanvasGame/>
    </Dashboard>
  );
};

export default page;
