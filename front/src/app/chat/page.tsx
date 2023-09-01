'use client';
import React from 'react';
import Dashboard from '../Dashboard';
import ChatNavbarLink from './components/chat.navbar.link';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { FaUsers } from "react-icons/fa";

import Cookies from 'js-cookie';
import { Socket, io } from 'socket.io-client';

const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
    const router = usePathname();

  return (
    <>
      <Dashboard>
		<div className=" h-full channeLnavbarmenu col-span-2 flex justify-center items-center border-2 sm:justify-around gap-4 w-full ">
			<ChatNavbarLink
				to="/chat/directmessage"
				label="direct Message"
				icon={HiChatBubbleLeftRight}
				active={router.includes('directmessage')}
			/>
			<ChatNavbarLink
				to="/chat/channels"
				label="channeL"
				icon={FaUsers}
				active={router.includes('channels')}
			/>
        </div>
		</Dashboard>
    </>
  );
}
