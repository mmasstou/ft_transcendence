"use client";
// imports  :
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';
import { Socket, io } from 'socket.io-client';
// components :
import ChanneLSidebarItem from './components/channel.sidebar.item';
import LefttsideModaL from './modaLs/LeftsideModal';
// hooks :
import LeftSidebarHook from './hooks/LeftSidebarHook';
import RightsidebarHook from './hooks/RightSidebarHook';
// helpers :
import getChannels from './actions/getChanneLs';
// icons :
// types :
import { RoomsType } from '@/types/types';

export default function page() {
  const [IsMounted, setIsMounted] = React.useState(false)
  const [ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
  const [socket, setSocket] = React.useState<Socket | null>(null)
  const query = useParams();
  const slug: string | undefined = query.slug ? typeof query.slug === 'string' ? query.slug : query.slug[0] : undefined
  const leftSidebarHook = LeftSidebarHook();
  const rightsidebarHook = RightsidebarHook()
  const UserId: any = Cookies.get('_id');
  const token = Cookies.get('token');
  if (!UserId || !token) return;

  if (IsMounted) {
    document.title = "Transcendence - Chat/channeL"
  }


  const GetData = async () => {
    // update channels :
    const ChanneLs = await getChannels(token)
    if (!ChanneLs) return
    setChannel(ChanneLs)
  }

  React.useEffect(() => {
    if (!token)
      return;
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
      transports: ['websocket'],
      auth: {
        token, // Pass the token as an authentication parameter
      },
    });
    setSocket(socket)
    GetData()
    setIsMounted(true)
    return () => { socket.disconnect() }
  }, [])

  React.useEffect(() => {
    if (!IsMounted) return


    // check for channels :
    // leave the channeLs :
    socket?.on(
      `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
      (data: any) => GetData())
  }, [socket])


  if (!IsMounted)
    return null
  return (
    <>
      <LefttsideModaL>
        {
          ChanneLs && ChanneLs.map((room: RoomsType, key) => (
            <ChanneLSidebarItem key={key} room={room}  active={room.slug === slug} />
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
