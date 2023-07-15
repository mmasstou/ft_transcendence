"use client"

import React from 'react'
import Dashboard from '@/app/Dashboard';
import Chat from '@/components/chat';
import ChanneLs from '@/components/chat/channel/channel.index';
import ChanneLNavbar from '@/components/chat/channel/channel.navbar';
import OnlineUsersModaL from '@/components/modals/RightsideModal';
import Conversations from '@/components/chat/chat.conversations';
import RightsideModal from '@/components/modals/LeftsideModal';

const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
  return (
    <Dashboard>
      <Chat>
        <ChanneLs>
          <ChanneLNavbar />
          <div className="flex flex-row justify-between h-full max-h-[91vh] w-full">
            <RightsideModal />
            <Conversations >

              <div>
                conversations
              </div>
            </Conversations>
            <OnlineUsersModaL />
          </div>
        </ChanneLs>
      </Chat>
    </Dashboard>
  )
}
