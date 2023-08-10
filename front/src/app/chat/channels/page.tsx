"use client"

import React, { useEffect } from 'react'
import Dashboard from '@/app/Dashboard';
import { RoomsType, membersType } from '@/types/types';
import { notFound, useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import ChanneLIndex from './components/channel.index';
import LoginHook from '@/hooks/auth/login';
import { Socket, io } from 'socket.io-client';
import getChannelWithId from './actions/getChannelWithId';
import getMemberWithId from './actions/getMemberWithId';
import getChannelMembersWithId from './actions/getChannelmembers';
import ChanneLaccessDeniedHook from './hooks/ChanneL.access.denied.hook';
import getChannels from './actions/getChanneLs';
import { toast } from 'react-hot-toast';
import MemberHasPermissionToAccess from './actions/MemberHasPermissionToAccess';
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
  const UserId: any = Cookies.get('_id');
  const loginhook = LoginHook()
  const router = useRouter()
  const channeLaccessDeniedHook = ChanneLaccessDeniedHook()

  if (IsMounted) {
    document.title = "Transcendence - Chat/channeL"
  }



  // create chat client socket
  useEffect(() => {
    if (!token)
      return;
    const socket = io(`${process.env.NEXT_PUBLIC_CHAT_URL_WS}`, {
      transports: ['websocket'],
      auth: {
        token: token,
      },
    });
    // socket.on('jwt_expired', () => {
    //   console.log("jwt_expired")
    //   Cookies.remove('token')
    //   Cookies.remove('_id')
    // })
    // Handle socket events here
    socket.on('connect', () => {

      setSocket(socket)
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
      socket.close()
    };
  }, [token]);

  useEffect(() => {
    socket?.on('removeToken', () => {
      Cookies.remove('token');
      Cookies.remove('_id');
      router.push('/')
    })
  },[socket])

  // render components when the body is render 
  useEffect(() => setIsMounted(true), [])
  // check if channel param is selected ?
  useEffect(() => {
    const token: any = Cookies.get('token');
    const channeLid = params.get('r')
    if (!channeLid || !token || !UserId) return;
    setChanneLsActive(channeLid);
    (async () => {
      // const ChanneLselectedInfo = await getChannelWithId(channeLid, token)
      // if (!ChanneLselectedInfo) {
      //   toast.error(`there's no channel with that param : ${channeLid}`)
      //   router.push('/chat/channels')
      // }
      const selectedInfo = await MemberHasPermissionToAccess(token, channeLid, UserId)
      if (!selectedInfo) {
        toast.error(`there's no channel with that param : ${channeLid}`)
        router.push('/chat/channels')
      }
    })();
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
      const userId = Cookies.get('_id')
      if (userId) {

        const Logedmemder = await getMemberWithId(userId, _ChanneLsActiveID, token)
        if (!Logedmemder) return
        const activeChannelsMembers = await getChannelMembersWithId(_ChanneLsActiveID, token)
        if (!activeChannelsMembers)
          return
        activeChannelsMembers.forEach((member: membersType) => {
          if (member.id === Logedmemder.id) {
            setmemberHasAccess(true)
          }
        });
        room && socket?.emit('accessToroom', room, (response: any) => {

        })
      }
    })();
  }, [_ChanneLsActiveID, socket])

  useEffect(() => {

    // get toaster loading id :
    const toastId = toast.loading('Finding all your Channels ...')
    // const ToasterId = toast.loading('Finding all your Channels ...')


    if (!IsMounted) {
      toast.remove(toastId)
      return
    }
    try {
      const token: any = Cookies.get('token');
      (async () => {
        if (!token) throw new Error('no token')
        const response = await getChannels(token)
        if (!response) throw new Error('not fond')
        // console.log("resp :", resp)
        setTimeout(() => {
          setChannel(response);
          toast.remove(toastId)
          toast.success(`find ${response.length} channel`)
        }, 2000)
      })();
    } catch (error) {
      console.log("error :", error)
      toast.remove(toastId)
      toast.error("no channels for now")
    }

    setIsMounted(true);
    return () => setIsMounted(false)
  }, [])


  if (!IsMounted)
    return null
  return (
    <Dashboard>
      <ChanneLIndex socket={socket} />
    </Dashboard>
  )
}
