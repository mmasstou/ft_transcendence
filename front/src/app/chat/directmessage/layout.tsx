'use client';
import React, { useEffect, useState } from 'react'
import Dashboard from '@/app/Dashboard';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { usePathname, useRouter } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import ChatNavbarLink from '../components/chat.navbar.link';
import Button from '../components/Button';
import { BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse, BsPersonAdd, BsFillPeopleFill, BsPeople } from "react-icons/bs";
import Cookies from 'js-cookie';
import { Changa } from 'next/font/google';
import Loading from '../channels/components/loading';
import ConversationList from './components/conversationList';
import FriendList from './components/friendList';
import SearchModal from './components/searchModal';

const metadata = {
    title: 'Transcendence',
    description: 'Online Pong Game',
};

const changa = Changa({
    weight: ['400', '700'],
      subsets: ['latin'],
      variable: '--font-changa',
    });  

const token = Cookies.get('token');
const UserId = Cookies.get('_id');

export default function RootLayout({ children }: { children: React.ReactNode }) {

    const router = usePathname();
    const rt = useRouter();
    const [isOpen, setOpening] = useState<boolean>(false);
    const [openFriendList, setFriendList] = useState<boolean>(false);
    const [createConversation, setConvCreation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    async function getCurrentUser() { 
        const response = await(await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${UserId}`, {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${token}`,
			},
		  })).json();
        setCurrentUser(response);
    }

    React.useEffect(() => {
        if (!token || !UserId) return rt.push('/');
        if (!router.includes('chat')) setIsLoading(true)
        getCurrentUser();
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)



      }, [])

    useEffect(() => { }, [isOpen, openFriendList])

    return (
        <html lang='en'>
            <body className={`${changa.className}`} suppressHydrationWarning={true}>
                {isLoading
                    ? < Loading background message="Direct Chat router loading ..." />
                    :
                    <Dashboard>
                        <div className='border-4 border-[#24323044] h-full'>
                            <div className="h-[3.5%] channeLnavbar grid grid-flow-row-dense grid-cols-4 justify-between items-center text-white px-2 py-1">
                                <div>
                                    {isOpen
                                        ? <Button
                                            icon={BsReverseLayoutSidebarInsetReverse}
                                            small
                                            outline
                                            onClick={() => { setOpening(false) }}
                                        />
                                        : <Button
                                            icon={BsLayoutSidebarInset}
                                            small
                                            outline
                                            onClick={() => { setOpening(true) }}
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
                                        onClick={() => { setConvCreation(!createConversation) }}
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

                            <div className='flex h-[95.5%] w-full'>
                                {isOpen ? <div className={`bg-[#243230] h-full overflow-y-auto w-full min-w-[320px] absolute sm:w-[320px] lg:relative z-[10]`}>
                                    <ConversationList user={currentUser}/>
                                </div> : <></>}
                                <div className='flex justify-center min-w-2/3 w-full'>
                                    {children}
                                </div>
                                {openFriendList ? <div className=' bg-[#243230] h-full w-[20%] min-w-[200px] max-w-[350px] '>
                                    <FriendList />
                                </div> : <></> }
                                <SearchModal open={createConversation} onClose={() => setConvCreation(false)}/>
                            </div>
                        </div>
                    </Dashboard>
                }
            </body>
        </html>
    )
}
