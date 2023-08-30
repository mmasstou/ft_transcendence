'use client';
import Dashboard from '@/app/Dashboard';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserCard from '@/components/profile/FriendCard';

interface User {
  id: string;
  login: string;
  avatar: string;
  Level: number;
}

const page = ({ params }: { params: { mode: string } }) => {
  const [users, setUsers] = useState<User[]>([]);
  const id = Cookies.get('_id');
  const router = useRouter();
  if (params.mode !== 'time' && params.mode !== 'score') router.push('/404');

  // body resquest example
  const body = {
    playerId: id,
    mode: params.mode,
  };
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
      });
  }, [setUsers]);
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
              up for a quick practice session to warm up? Select the{' '}
              <strong className="text-yellow-500">Robot</strong> and hone your
              techniques against our responsive AI opponents. Want to challenge
              friends ? Click on{' '}
              <strong className="text-secondary">Random</strong> or{' '}
              <strong className="text-orange-500">Friend</strong> to enter our
              vibrant community and engage in exhilarating matches.
            </p>
            <div className="flex gap-10 my-4 w-full justify-center">
              <button
                className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2 border-yellow-500 rounded-xl font-bold text-yellow-500"
                onClick={() => {
                  axios
                    .post(
                      `${process.env.NEXT_PUBLIC_API_URL}/game/BotGame`,
                      body
                    )
                    .then(() => {
                      router.push(`/game/${params.mode}/robot`);
                    })
                    .catch((err) => {
                      router.push('/game');
                      toast.error(err.response.data.reason);
                    });
                }}
              >
                Robot
              </button>
              <button
                className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2 border-secondary rounded-xl font-bold text-secondary"
                onClick={() => {
                  axios
                    .post(
                      `${process.env.NEXT_PUBLIC_API_URL}/game/RandomGame`,
                      body
                    )
                    .then((res) => {
                      router.push(`/game/${params.mode}/random`);
                    })
                    .catch((err) => {
                      router.push('/game');
                      toast.error(err.response.data.reason);
                    });
                }}
              >
                Random
              </button>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2  border-orange-500 rounded-xl font-bold text-orange-500 focus:outline-none">
                    Friend
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
                  <Dialog.Content
                    className="data-[state=open]:animate-contentShow text-white rounded-lg bg-[#243230] p-6 fixed top-[25%] left-1/2 max-h-full w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] 
                    shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
                    focus:outline-none"
                  >
                    <Dialog.Title className="text-lg lg:text-xl 2xl:text-2xl">
                      Invite a friend !
                    </Dialog.Title>
                    <div className="w-full flex flex-col">
                      {users.map((user) => {
                        if (user.id !== id)
                          return (
                            <UserCard
                              username={user.login}
                              avatar={user.avatar}
                              online
                            />
                          );
                      })}
                    </div>
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
            <Image
              fill
              src="/game-mode 1.svg"
              alt="game-mode"
              className=""
              priority
            />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default page;
