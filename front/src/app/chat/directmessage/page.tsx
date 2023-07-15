import React from 'react'
import Dashboard from '@/app/Dashboard';
import Chat from '@/components/chat';
import ChanneLs from '@/components/chat/channel/channel.index';
import ChanneLNavbar from '@/components/chat/channel/channel.navbar';

const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
  return (
    <Dashboard>
      <Chat>
        {/* <ChatBody /> */}
        <ChanneLs>
        <ChanneLNavbar />
        </ChanneLs>
      </Chat>
    </Dashboard>
  )
}
