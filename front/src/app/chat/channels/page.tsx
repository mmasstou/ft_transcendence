"use client"

import React, { useEffect } from 'react'
import Dashboard from '@/app/Dashboard';
<<<<<<< HEAD
import { RoomsType, membersType } from '@/types/types';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
=======
import { RoomsType } from '@/types/types';
import { useSearchParams } from 'next/navigation';
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
import getChannels from '@/actions/channels/getChanneLs';
import Cookies from 'js-cookie';
import ChanneLIndex from './components/channel.index';
import LoginHook from '@/hooks/auth/login';
<<<<<<< HEAD
import { Socket, io } from 'socket.io-client';
import getChannelWithId from './actions/getChannelWithId';
import getMemberWithId from './actions/getMemberWithId';
import getChannelMembersWithId from './actions/getChannelmembers';
import ChanneLaccessDeniedHook from './hooks/ChanneL.access.denied.hook';
=======
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
  const [IsMounted, setIsMounted] = React.useState(false)
  const [_ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
  const [_ChanneLsActiveID, setChanneLsActive] = React.useState<string | null>(null)
<<<<<<< HEAD
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

=======
  const params = useSearchParams()
  const loginhook = LoginHook()
  document.title = "Transcendence - Chat/channeL"
  
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
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
<<<<<<< HEAD

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

=======
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
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
<<<<<<< HEAD
          // console.log("data :", data)
          setChannel(data);
        }
        // console.log("resp :", resp)
      })();
    } catch (error) {
      // console.log("error :", error)
=======
          console.log("data :", data)
          setChannel(data);
        }
        console.log("resp :", resp)
      })();
    } catch (error) {
      console.log("error :", error)
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
    }

    setIsMounted(true);
    return () => setIsMounted(false)
  }, [IsMounted])


  if (!IsMounted)
    return null
  return (
    <Dashboard>
<<<<<<< HEAD
      <ChanneLIndex socket={socket} />
=======
     <ChanneLIndex />
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
    </Dashboard>
  )
}
