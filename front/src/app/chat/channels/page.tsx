"use client";
// imports  :
import React from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Socket } from 'socket.io-client';
import Image from 'next/image';
// components :
import Dashboard from '@/app/Dashboard';
import Button from '../components/Button';
import ChatNavbarLink from '../components/chat.navbar.link';
import LefttsideModaL from './modaLs/LeftsideModal';
import ChanneLSidebarItem from './components/channel.sidebar.item';
// hooks :
import LeftSidebarHook from './hooks/LeftSidebarHook';
import ChanneLcreatemodaLHook from './hooks/channel.create.hook';
import RightsidebarHook from './hooks/RightSidebarHook';
import ChanneLFindRoommodaLHook from './hooks/channel.find.room.hook';
// helpers :
import getChannels from './actions/getChanneLs';
// icons :
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { FaUsers } from 'react-icons/fa';
import { RiSearchLine } from 'react-icons/ri';
import { BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
// types :
import { RoomsType } from '@/types/types';
import InitSocket from './actions/InitSocket';

export default function page() {
  const [IsMounted, setIsMounted] = React.useState(false)
  const [ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
  const query = useParams();
  const slug: string | undefined = query.slug ? typeof query.slug === 'string' ? query.slug : query.slug[0] : undefined
  const leftSidebarHook = LeftSidebarHook();
  const rightsidebarHook = RightsidebarHook()
  const UserId: any = Cookies.get('_id');
  const token = Cookies.get('token');
  if (!UserId || !token) return;

  React.useEffect(() => { 
    (async () => {
      const ChanneLs = await getChannels(token)
      if (!ChanneLs) return
      setChannel(ChanneLs)
      // setIsLoading(false)
    })();
    setIsMounted(true); 
  
  }, [])

  if (!IsMounted)
    return null
  return (
    <>
      <LefttsideModaL>
        {
          ChanneLs && ChanneLs.map((room: RoomsType, key) => (
            <ChanneLSidebarItem key={key} room={room} viewd={8} active={room.slug === slug} />
          ))
        }
      </LefttsideModaL>
      <div className={`${(leftSidebarHook.IsOpen || rightsidebarHook.IsOpen) && 'hidden md:flex'} w-full`}>
        <div className="flex flex-col justify-center items-center h-full w-full">
          <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
        </div>
      </div>
    </>

  )
}
