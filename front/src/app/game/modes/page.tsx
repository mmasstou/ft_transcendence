'use client';
import Dashboard from '@/app/Dashboard';
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import Image from 'next/image';
import CanvasGame from '@/components/game/CanvasGame';

const page = () => {
  return (
    <Dashboard>
      <div className="w-full flex flex-col gap-10 items-center p-4 text-left tracking-wide text-white">
        <h1 className="text-2xl xl:text-4xl 2xl:text-5xl font-bold">
          Game Modes
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
              <button className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2 border-yellow-500 rounded-xl font-bold text-yellow-500">
                Robot
              </button>
              <button className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2 border-secondary rounded-xl font-bold text-secondary">
                Random
              </button>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2  border-orange-500 rounded-xl font-bold text-orange-500 focus:outline-none">
                    Friend
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0" />
                  <Dialog.Content
                    className="data-[state=open]:animate-contentShow text-white rounded-lg bg-[#243230] p-6 fixed top-[25%] left-[50%] max-h-full w-[90vw] max-w-[800px] translate-x-[-50%] lg:translate-x-[-45%] xl:translate-x-[-35%] translate-y-[-50%] 
                  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
                  focus:outline-none"
                  >
                    <Dialog.Title className="text-lg lg:text-xl 2xl:text-2xl">Invite a friend !</Dialog.Title>
                    <Dialog.Close asChild>
                      <button className="text-white top-5 right-5 absolute">
                        <Cross2Icon />
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] xl:h-[600px] w-full">
            <Image fill src="/game-mode 1.svg" alt="game-mode" className="" />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default page;
