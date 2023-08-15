'use client';
import './dashboard.css';
import Sidebar from '@/components/Dashboard/sidebar/Sidebar';
import Login from '@/components/auth/modaLs/Login';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ChanneLaccessDeniedModaL from './chat/channels/modaLs/channel.access.denied.modaL';
import ChanneLPasswordAccessModaL from './chat/channels/modaLs/channel.access.password.modaL';
import { useEffect } from 'react';
import ChanneLSettingsModaL from './chat/channels/modaLs/channel.settings.modaL';
import Header from '@/components/Dashboard/Header/Header';
import ChanneLFindRoommodaL from './chat/channels/modaLs/channel.find.room.modaL';
import { Socket, io } from 'socket.io-client';
import ChanneLCreateModaL from './chat/channels/modaLs/channel.create.modaL';
import { membersType, userType } from '@/types/types';
import MyToast from '@/components/ui/Toast/MyToast';
import ChanneLConfirmActionModaL from './chat/channels/modaLs/channel.confirm.action';
import { ro } from 'date-fns/locale';
import StartGame from './chat/channels/actions/startgame';
interface Props {
  children: React.ReactNode;
}

const Dashboard = ({ children }: Props) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const router = useRouter();
  const params = useSearchParams()
  const [Notifications, setNotifications] = React.useState<any>(null)
  const userId = Cookies.get('_id')
  const token: any = Cookies.get('token');
  if (!token || !userId) return;


  socket?.on('notificationEvent', (data) => {
    console.log("notificationEvent data :", data)
    setNotifications(data)

    return () => {
      setNotifications(null)
    }

  })

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
    return () => {
      return;
    };
  }, [token]);
  useEffect(() => {

    if (!token) return
    const socket: Socket = io(`${process.env.NEXT_PUBLIC_USERSOCKET_URL_WS}`, {
      auth: {
        token: `${token}`,
        id: `${Cookies.get("_id")}`
      }
    });
    setSocket(socket);
    socket && socket.on("connected", (data) => { })
    return () => {
      socket && socket.disconnect();
    };

  }, [])

  useEffect(() => {
    socket?.on('GameResponse', (data: any) => {
      if (data.sender.id === userId) {
        (async () => {
          if (!token) return;
          const body = {       ///////////////////////////////////////////////////////// body
              player2Id: data.sender.id,
              player1Id: data.userId,
              mode: data.mode
          }
          const g = await StartGame(body, token);
          if (!g) return;
          router.push(`/game/${data.mode}/friend`)
        })();

      }
      if (data.userId === userId) {
        router.push(`/game/${data.mode}/friend`)
      }
    })
  }, [socket]);

  return (
    <>
      <Login />
      {/* <ChanneLModal /> */}
      <ChanneLConfirmActionModaL />
      <ChanneLPasswordAccessModaL />
      <ChanneLCreateModaL />
      <ChanneLSettingsModaL />
      <ChanneLFindRoommodaL />
      <ChanneLaccessDeniedModaL />
      <ChanneLPasswordAccessModaL />
      {
        Notifications && <MyToast OnAccept={() => {
          if (!params) return;
          const userId = Cookies.get('_id')
          if (!userId) return
          console.log("++++++++++++++++++++++++>:", userId)
          socket?.emit('AcceptGame', { userId: userId, sender: Notifications.sender, mode: Notifications.mode })
        }} isOpen user={Notifications.sender.login} message={Notifications.message} />
      }
      <div className="dashboard bg-primary overflow-y-auto">
        <header className="bg-transparent flex items-center justify-between px-5 ">
          <Header socket={socket} />
        </header>

        <main className="">{children}</main>

        <div id="Sidebar" className="">
          <Sidebar />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Dashboard;
