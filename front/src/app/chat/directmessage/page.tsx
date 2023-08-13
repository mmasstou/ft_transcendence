'use client';
import React, { useState } from 'react'
import Dashboard from '@/app/Dashboard';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import ChatNavbarLink from '../components/chat.navbar.link';
import Button from '../components/Button';
import { BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs';


const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
    const router = usePathname();
	const [isOpen, setOpening] = useState(false);

  return (
    <Dashboard>
    <div className='h-full border-4 border-[#24323044]'>
		<div className="channeLnavbarmenu col-span-2 flex justify-center sm:justify-around gap-4 w-full">
				<div>
					<Button
						{isOpen ? icon={BsLayoutSidebarInset} : icon={BsReverseLayoutSidebarInsetReverse}}
						small
						outline
						onClick={() => setOpening(true)}
					/>
				</div>
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
	</div>
    </Dashboard>
  )
}
