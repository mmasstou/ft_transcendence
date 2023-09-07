'use client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import findAlldmsForLoginUser from './channels/actions/findAlldmsForLoginUser';
import LeftSidebarHook from './channels/hooks/LeftSidebarHook';
import LefttsideModaL from './channels/modaLs/LeftsideModal';
import Conversation from './components/Conversation';
import { ChanneLContext } from './channels/providers/channel.provider';
import { Socket } from 'socket.io-client';
import getUserWithId from './channels/actions/getUserWithId';
import { userType } from '@/types/types';
import { useRouter } from 'next/navigation';


export default function page() {
  const [ConversationList, setConversationList] = React.useState<any>(null);
  const [IsMounted, setIsMounted] = React.useState(false);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const leftSidebarHook = LeftSidebarHook();
  const token = Cookies.get('token');
  const id = Cookies.get('_id');
  const ChanneLContextee: any = React.useContext(ChanneLContext)
  const [reload, setReload] = React.useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<userType | null>(null);
  const router = useRouter();


  const UpdateData = async () => {
    if (!token) return;
    const res = await findAlldmsForLoginUser(token)
    if (res) setConversationList(res);
  }

  React.useEffect(() => {
    setSocket(ChanneLContextee.DmSocket)

    ChanneLContextee.DmSocket?.on('createDm', (payload: { senderId: string; receiverId: string }) => {
      setReload(prev => !prev);
      ChanneLContextee.DmSocket.emit('accessToDm', payload);

    })

    ChanneLContextee.DmSocket?.on('deleteDm', (payload: { senderId: string; receiverId: string }) => {
      setReload(prev => !prev);
    })
    UpdateData()
    return () => {
      ChanneLContextee.DmSocket?.off('createDm')
      ChanneLContextee.DmSocket?.off('deleteDm')
    }
  }, [ChanneLContextee])

  React.useEffect(() => {
    UpdateData()
    if (!token || !id) return router.push('/');
    (async () => {
      const user: userType | null = await getUserWithId(id, token);
      if (user)
        setCurrentUser(user);
    })()
    setIsMounted(true)
  }, []);

  React.useEffect(() => { UpdateData() }, [reload])

  if (!IsMounted) return
  return (
    <>
      <LefttsideModaL>
        <section className='flex items-center gap-4 border-b border-primary pb-3 px-5 mb-4'>
          {currentUser ? <Image src={currentUser.avatar} alt='avatar' width={55} height={55} className='rounded-[50%]'/> : <></>}
          <span className='text-white'>Conversations :</span>
        </section>
        <section>
          {
            ConversationList && ConversationList.length ? ConversationList.map((md: any, key: number) => (
              <Conversation md={md} key={md.id}/>
            )) : <span className='text-[#1EF0AE] p-4'>No Conversation</span>
          }
        </section>
      </LefttsideModaL>
      <div className={`${(leftSidebarHook.IsOpen) && 'hidden md:flex'} w-full`}>
        <div className="flex flex-col justify-center items-center h-full w-full">
          <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
        </div>
      </div>
    </>

  )
}
