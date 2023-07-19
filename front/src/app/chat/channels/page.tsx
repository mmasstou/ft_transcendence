"use client"

import React, { useEffect } from 'react'
import Dashboard from '@/app/Dashboard';
import { RoomsType } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import getChannels from '@/actions/channels/getChanneLs';
import Cookies from 'js-cookie';
import ChanneLIndex from './components/channel.index';
const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
  const [IsMounted, setIsMounted] = React.useState(false)
  const [_ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
  const [_ChanneLsActiveID, setChanneLsActive] = React.useState<string | null>(null)
  const params = useSearchParams()

  document.title = "Transcendence - Chat"
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (params) {
      setChanneLsActive(params.get('r'))
    }
  }, [params])
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
          console.log("data :", data)
          setChannel(data);
        }
        console.log("resp :", resp)
      })();
    } catch (error) {
      console.log("error :", error)
    }

    setIsMounted(true);
    return () => setIsMounted(false)
  }, [IsMounted])


  if (!IsMounted)
    return null
  return (
    <Dashboard>
     <ChanneLIndex />
    </Dashboard>
  )
}
