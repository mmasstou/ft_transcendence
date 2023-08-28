'use client';
import { RiLogoutBoxFill } from 'react-icons/ri';
import * as Popover from '@radix-ui/react-popover';
import Cookies from 'js-cookie';
import MyAvatar from '@/components/profile/MyAvatar';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import axios from 'axios';
import { userType } from '@/types/types';

export interface User {
  login?: string;
}

export const Logout: React.FC = (): JSX.Element => {
  const [IsMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<userType | null>(null);
  const id = Cookies.get('_id');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if(!IsMounted) return;
    axios.get(`http://localhost:80/api/users/${id}`).then((res) => {
      setUser(res.data);
    });
  }, [id]);

  const logoutHandle = () => {
    (async () => {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      if (resp.status === 200) {
        Cookies.remove('token');
        Cookies.remove('_id');
        Cookies.remove('tableId');
        router.push('/');
      }
    })();
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild aria-controls="radix-:R1mcq:">
        <button aria-label="Update dimensions">
          <div className="cursor-pointer w-[32px] h-[32px]">
            {<MyAvatar User={user} />}
          </div>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="text-white py-6 px-2 xl:px-6 rounded w-[200px] mr-3 bg-[#2B504B] shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] "
          sideOffset={5}
        >
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm xl:text-lg">{user && user?.login} 👋</p>
            <div className="w-3/4 border-b-[0.1vh] border-white opacity-50"></div>
            <a
              onClick={() => {}}
              href="/"
              className="flex justify-between items-center my-1 hover:text-red-500"
            >
              <RiLogoutBoxFill className="" />
              Logout
            </a>
          </div>
          <Popover.Arrow className="fill-[#2B504B]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
