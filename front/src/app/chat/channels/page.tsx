"use client"

import React, { useEffect } from 'react'
import Dashboard from '@/app/Dashboard';
import { RoomsType } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import getChannels from '@/actions/channels/getChanneLs';
import Cookies from 'js-cookie';
import ChanneLIndex from './components/channel.index';
import LoginHook from '@/hooks/auth/login';
import { Socket, io } from 'socket.io-client';
import getChannelWithId from './actions/getChannelWithId';
const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
  const [IsMounted, setIsMounted] = React.useState(false)
  const [_ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
  const [_ChanneLsActiveID, setChanneLsActive] = React.useState<string | null>(null)
  const [socket, setSocket] = React.useState<Socket | null>(null)
  const params = useSearchParams()
  const token: any = Cookies.get('token');
  const loginhook = LoginHook()
  document.title = "Transcendence - Chat/channeL"



  useEffect(() => {
    if (!token)
      return;
    const socket = io('http://localhost/chat', {
      transports: ['websocket'],
      auth: {
        token: token,
      },
    });

    // Handle socket events here
    socket.on('connect', () => {
      console.log('Socket connected');
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
      let JoinData : any = room
      const userId = Cookies.get('_id')
      if (userId){
        JoinData.loginUser = userId
        console.log('_ChanneLsActiveID : ', _ChanneLsActiveID)
        socket?.emit('joinroom', JoinData, (response: any) => {
          console.log('join response : ', response)
        })
      }
    })();
  }, [_ChanneLsActiveID, socket])

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
