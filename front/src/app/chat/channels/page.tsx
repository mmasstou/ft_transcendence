"use client"

import React, { useEffect } from 'react'
import Dashboard from '@/app/Dashboard';
import Chat from '@/components/chat';
import ChanneLs from '@/components/chat/channel/channel.index';
import ChanneLNavbar from '@/components/chat/channel/channel.navbar';
import RightsideModal from '@/modals/RightsideModal';
import Conversations from '@/components/chat/chat.conversations';
import LefttsideModal from '@/modals/LeftsideModal';
import ChanneLroom from '@/components/chat/channel/channel.room';
import { RoomsType } from '@/types/types';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import getChannels from '@/actions/channels/getChanneLs';
import Cookies from 'js-cookie';
const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [is_active, setIs_active] = React.useState(false)
  const [IsMounted, setIsMounted] = React.useState(false)
  const [_ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
  const [_ChanneLsActiveID, setChanneLsActive] = React.useState<string | null>(null)
  const params = useSearchParams()


  
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

  const LeftSide = (
    <div className='flex flex-col  p-4'>
      {
        _ChanneLs && _ChanneLs.map((item: RoomsType, key: number) => (
          <ChanneLroom is_active={item.id === _ChanneLsActiveID} key={key} room={item} />
        ))
      }
    </div>
  )
  if (!IsMounted)
    return null
  return (
    <Dashboard>
      <Chat>
        <ChanneLs>
          <ChanneLNavbar />
          <div className="flex flex-row justify-between h-full max-h-[91vh] w-full">
            <LefttsideModal childern={LeftSide} />
            <Conversations />
            <RightsideModal />
          </div>
        </ChanneLs>
      </Chat>
    </Dashboard>
  )
}
