"use client"

import React, { useEffect } from 'react'
import Dashboard from '@/app/Dashboard';
import { RoomsType, membersType } from '@/types/types';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import getChannels from '@/actions/channels/getChanneLs';
import Cookies from 'js-cookie';
import ChanneLIndex from './components/channel.index';
import LoginHook from '@/hooks/auth/login';
import { Socket, io } from 'socket.io-client';
import getChannelWithId from './actions/getChannelWithId';
import getMemberWithId from './actions/getMemberWithId';
import getChannelMembersWithId from './actions/getChannelmembers';
import ChanneLaccessDeniedHook from './hooks/ChanneL.access.denied.hook';
const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
  const [IsMounted, setIsMounted] = React.useState(false)
  const [_ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
  const [_ChanneLsActiveID, setChanneLsActive] = React.useState<string | null>(null)
  const [memberHasAccess, setmemberHasAccess] = React.useState<boolean>(false)
  const [socket, setSocket] = React.useState<Socket | null>(null)
  const params = useSearchParams()
  const token: any = Cookies.get('token');
  const loginhook = LoginHook()
  const channeLaccessDeniedHook = ChanneLaccessDeniedHook()

  if (IsMounted){
    document.title = "Transcendence - Chat/channeL"
  }



  useEffect(() => {
    if (!token)
      return;
    const socket = io(`${process.env.NEXT_PUBLIC_CHAT_URL_WS}`, {
      transports: ['websocket'],
      auth: {
        token: token,
      },
    });

    // Handle socket events here
    socket.on('connect', () => {

      setSocket(socket)
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    const token: any = Cookies.get('token');
    if (!token)
      loginhook.onOpen()
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (params) {
      setChanneLsActive(params.get('r'))
    }
  }, [params])

  useEffect(() => {
    if (!_ChanneLsActiveID)
      return
    const token: any = Cookies.get('token');
    (async () => {
      const room = await getChannelWithId(_ChanneLsActiveID, token)
      let JoinData: any = room
      const userId = Cookies.get('_id')
      if (userId) {
        
        const Logedmemder = await getMemberWithId(userId, _ChanneLsActiveID, token)
        const activeChannelsMembers = await getChannelMembersWithId(_ChanneLsActiveID, token)
        activeChannelsMembers.forEach((member: membersType) => {
          if (member.id === Logedmemder.id) {


            setmemberHasAccess(true)
          }
        });
        JoinData.loginUser = userId
        socket?.emit('joinroom', JoinData, (response: any) => {

        })
      }
    })();
  }, [_ChanneLsActiveID, socket])

  // React.useEffect(() => {
  //   console.log("+page+> memberHasAccess :", memberHasAccess)
  //   console.log("+page+> _ChanneLsActiveID :", _ChanneLsActiveID)
  //   if (_ChanneLsActiveID && !memberHasAccess) {
  //     channeLaccessDeniedHook.onOpen()
  //   }
  // }, [memberHasAccess, _ChanneLsActiveID])

  useEffect(() => {
    if (!IsMounted)
      return
    try {
      const token: any = Cookies.get('token');
      (async () => {
        if (!token)
          return;
        const resp = await getChannels(token)
        if (resp && resp.ok) {
          const data = await resp.json()
          // console.log("data :", data)
          setChannel(data);
        }
        // console.log("resp :", resp)
      })();
    } catch (error) {
      // console.log("error :", error)
    }

    setIsMounted(true);
    return () => setIsMounted(false)
  }, [IsMounted])


  if (!IsMounted)
    return null
  return (
    <Dashboard>
      <ChanneLIndex socket={socket} />
    </Dashboard>
  )
}
