'use client';
import React, { useEffect, useState } from 'react'
import Dashboard from '@/app/Dashboard';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import ChatNavbarLink from '../components/chat.navbar.link';
import Button from '../components/Button';
import { BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse, BsPersonAdd, BsFillPeopleFill, BsPeople } from "react-icons/bs";
import { IconType } from 'react-icons';
import PrivateConversation from './components/privateConversation';


const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
    const router = usePathname();
	const [isOpen, setOpening] = useState<boolean>(false);
	const [createConversation, setConvCreation] = useState(false);
	const [openFriendList, setFriendList] = useState(false);

	useEffect(() => {}, [isOpen, openFriendList])

  return (
    <Dashboard>
	<div className='border-4 border-[#24323044] h-full'>
		<div className="channeLnavbar grid grid-flow-row-dense grid-cols-4 justify-between items-center text-white px-2 py-1">
			<div>
				{isOpen
					? <Button
						icon={BsReverseLayoutSidebarInsetReverse}
						small
						outline
						onClick={() => {setOpening(false)}}
					/>
					: <Button
						icon={BsLayoutSidebarInset}
						small
						outline
						onClick={() => {setOpening(true)}}
					/>
				}
			</div>
			<div className="channeLnavbarmenu col-span-2 flex justify-center  sm:justify-around gap-4 w-full ">
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
			<div className="flex justify-end items-center gap-2">
				<Button
					icon={BsPersonAdd}
					small
					outline
					onClick={() => {setConvCreation(!createConversation)}}
				/>
				{openFriendList ? 
					<Button 
						icon={BsPeople}
						small
						outline
						onClick={() => setFriendList(!openFriendList)}
					/> 
					: <Button 
						icon={BsFillPeopleFill}
						small
						outline
						onClick={() => setFriendList(!openFriendList)}
					/>
				}
			</div>
		</div>
		<PrivateConversation isOpen={isOpen} openFriendList={openFriendList} createConversation={createConversation} setFriendList={setFriendList} setConvCreation={setConvCreation}/>
	</div>
    </Dashboard>
  )
}
