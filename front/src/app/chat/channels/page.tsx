import React from 'react'
import Dashboard from '@/app/Dashboard';
import Chat from '@/components/chat';
// import ChatBody from '@/components/chat/chat.body';
import ChanneLs from '@/components/chat/channel/channel.index';
import ChanneLNavbar from '@/components/chat/channel/channel.navbar';
import ChatMain from '@/components/chat/chat.main';
import OnlineUsersModaL from '@/components/modals/OnlineUsersModaL';

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
          <div className="flex flex-row justify-between h-full w-full">
            <div className=" w-full h-full "><ChatMain /></div>
            <div className="flex justify-end items-end h-full"><OnlineUsersModaL /></div>
          </div>
        </ChanneLs>
      </Chat>
    </Dashboard>
  )
}
