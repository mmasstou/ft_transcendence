"use client"

import React from 'react'
import Dashboard from '@/app/Dashboard';
import Chat from '@/components/chat';
import ChanneLs from '@/components/chat/channel/channel.index';
import ChanneLNavbar from '@/components/chat/channel/channel.navbar';
import OnlineUsersModaL from '@/modals/RightsideModal';
import Conversations from '@/components/chat/chat.conversations';
import LefttsideModal from '@/modals/LeftsideModal';
import ChanneLroom from '@/components/chat/channel/channel.room';
import { RoomsType } from '@/types/types';
import { useRouter } from 'next/navigation';

const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [is_active, setIs_active] = React.useState(false)
  const LeftSide = (
    <div className='flex flex-col  p-4'>
     <ChanneLroom room={{
        id: '',
        name: 'room 01',
        type: '',
        created_at: '',
        updated_at: '',
        members: [],
        messages: []
      }}   />
     <ChanneLroom 
     is_active
     room={{
        id: '',
        name: 'room 02',
        type: '',
        created_at: '',
        updated_at: '',
        members: [],
        messages: []
      } }   />
    </div>
  )
  return (
    <Dashboard>
      <Chat>
        <ChanneLs>
          <ChanneLNavbar />
          <div className="flex flex-row justify-between h-full max-h-[91vh] w-full">
            <LefttsideModal childern={LeftSide} />
            <Conversations />
            <OnlineUsersModaL />
          </div>
        </ChanneLs>
      </Chat>
    </Dashboard>
  )
}
