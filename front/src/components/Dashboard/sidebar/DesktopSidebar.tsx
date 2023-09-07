'use client';
import { usePathname } from 'next/navigation';
import { CgProfile } from 'react-icons/cg';
import { AiFillWechat } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import { IoLogoGameControllerB } from 'react-icons/io';
import MenuItem from './MenuItem';
import { MdLeaderboard } from 'react-icons/md';

const DesktopSidebar = () => {
  const router = usePathname();

  return (
    <nav className="flex flex-col justify-between items-center h-full p-1">
      <ul className="flex flex-col justify-center items-center gap-12 w-full h-full">
        <MenuItem
          isActive={router.includes('/profile')}
          href="/profile"
          icon={CgProfile}
        />
        <MenuItem
          isActive={router.includes('/chat')}
          href="/chat"
          icon={AiFillWechat}
        />
        <MenuItem
          isActive={router.includes('/users')}
          href="/users"
          icon={FaUsers}
        />
        <MenuItem
          isActive={router.includes('/game')}
          href="/game"
          icon={IoLogoGameControllerB}
        />
        <MenuItem
          isActive={router.includes('/leaderboard')}
          href="/leaderboard"
          icon={MdLeaderboard}
        />
      </ul>
    </nav>
  );
};

export default DesktopSidebar;
