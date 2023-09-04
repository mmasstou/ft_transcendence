'use client';
import { usePathname } from 'next/navigation';
import { AiFillWechat } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { FaUsers } from 'react-icons/fa';
import { IoLogoGameControllerB } from 'react-icons/io';
import { MdLeaderboard } from 'react-icons/md';
import MenuItem from './MenuItem';

const SidebarMobile = () => {
  const router = usePathname();

  return (
    <nav className="fixed bottom-0 bg-[#243230] h-[5vh] w-full px-6 py-4 rounded-t-xl md:hidden ">
      <ul className="relative h-full flex flex-row justify-around items-center">
        <MenuItem
          isActive={router === '/profile'}
          href="/profile"
          icon={CgProfile}
        />
        <MenuItem
          isActive={router === '/chat'}
          href="/chat/directmessage"
          icon={AiFillWechat}
        />
        <MenuItem isActive={router === '/users'} href="/users" icon={FaUsers} />
        <MenuItem
          isActive={router === '/game'}
          href="/game"
          icon={IoLogoGameControllerB}
        />
        <MenuItem
          isActive={router === '/leaderboard'}
          href="/leaderboard"
          icon={MdLeaderboard}
        />
      </ul>
    </nav>
  );
};

export default SidebarMobile;
