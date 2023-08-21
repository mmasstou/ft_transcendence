'use client';
import Image from 'next/image';
import Dashboard from '../Dashboard';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import GameThemes from '../../../lib/GameThemes';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';

const page = () => {
  let selectedTheme = GameThemes[0];
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
                  <Dialog.Overlay
                    onPointerDown={(e) => e.stopPropagation()}
                    className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0"
                  />
                  <Dialog.Content
                    className="flex flex-col items-center gap-6 lg:gap-8 xl:gap-10 data-[state=open]:animate-contentShow text-white rounded-lg bg-[#243230] p-6 fixed top-1/2 left-1/2 max-h-full w-[80vw] md:w-[50vw] xl:w-[35vw] translate-x-[-50%] translate-y-[-50%] 
                  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
                  focus:outline-none"
                  >
                    <Dialog.Title className="text-xl lg:text-2xl xl:text-3xl font-bold tracking-wide">
                      Game settings
                    </Dialog.Title>
                    <div className="grid grid-cols-3 gap-4 md:gap-6 2xl:gap-10 xl:text-lg">
                      {GameThemes.map((theme, index) => {
                        const gradientStyle = {
                          backgroundImage: `linear-gradient(to right, ${theme.background[0]}, ${theme.background[1]})`,
                        };
                        return (
                          <button
                            key={index}
                            className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-md ring-2 ring-transparent focus:ring-secondary transition-all`}
                            style={gradientStyle}
                            onClick={() => {selectedTheme = GameThemes[index]}}
                          />
                        );
                      })}
                    </div>
                    <div className="flex gap-4">
                    <Dialog.Close asChild>
                        <button className=" px-4 py-1 xl:px-6 xl:py-2 border xl:border-2  border-secondary rounded-xl font-bold text-secondary focus:outline-none" onClick={() => {
                          const body = {
                            id: Cookies.get('_id'),
                            theme: selectedTheme
                          };
                          axios.post(`${process.env.NEXT_PUBLIC_API_URL}/game/UpdateTheme`, body)
                          .catch((err) => {
                            toast.error(err.response.data.reason);
                          });
                        }}>
                          Save
                        </button>
                        </Dialog.Close>
                      <Dialog.Close asChild>
                        <button className=" px-4 py-1 xl:px-6 xl:py-2 border xl:border-2  border-red-500 rounded-xl font-bold text-red-500 focus:outline-none">
                          Cancel
                        </button>
                      </Dialog.Close>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
              <Link
                href={'/game/time'}
                className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2 border-yellow-500 rounded-xl font-bold text-yellow-500"
              >
                Time Mode
              </Link>
              <Link
                href={'/game/score'}
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
      {/* <CanvasGame/> */}
    </Dashboard>
  );
};

export default page;
