'use client'
import Image from 'next/image';
import Dashboard from '../Dashboard';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import GameThemes from '../../../lib/GameThemes';


const page = () => {
  return (
    <Dashboard>
      <div className="w-full flex flex-col gap-10 items-center p-4 text-left tracking-wide text-white">
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
            <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2  border-sky-500 rounded-xl font-bold text-sky-500 focus:outline-none">
                    Settings
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0" />
                  <Dialog.Content
                    className="data-[state=open]:animate-contentShow flex flex-col items-center gap-4 xl:gap-8 text-white rounded-lg bg-[#243230] p-6 fixed top-[25%] left-[50%] max-h-full w-[90vw] max-w-[800px] translate-x-[-50%] lg:translate-x-[-45%] xl:translate-x-[-35%] translate-y-[-50%] 
                    shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
                    focus:outline-none"
                  >
                    <Dialog.Title className="text-lg lg:text-xl 2xl:text-2xl self-start">Game settings</Dialog.Title>
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 md:gap-6 2xl:gap-10 xl:text-lg'>
                      {
                        GameThemes.map((theme, index) => {
                          const gradientStyle = {
                            backgroundImage: `linear-gradient(to right, ${theme.left}, ${theme.right})`,
                          };
                          return (
                            <button key={index} className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-md ring-2 ring-transparent focus:ring-secondary transition-all`} style={gradientStyle}/>
                          )
                        }
                        )
                      }
                    </div>
                    <div className='flex gap-4'>
                      <button className=" px-4 py-1 xl:px-6 xl:py-2 border xl:border-2  border-secondary rounded-xl font-bold text-secondary focus:outline-none">
                        Save
                      </button>
                    <Dialog.Close asChild>
                      <button className=" px-4 py-1 xl:px-6 xl:py-2 border xl:border-2  border-red-500 rounded-xl font-bold text-red-500 focus:outline-none">
                        Cancel
                      </button>
                    </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                      <button className="text-white top-5 right-5 absolute">
                        <Cross2Icon />
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
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
      </div>
    </Dashboard>
  );
};

export default page;
