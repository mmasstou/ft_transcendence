'use client';
import './dashboard.css';
import Sidebar from '@/components/Dashboard/sidebar/Sidebar';
import Login from '@/components/auth/modaLs/Login';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
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
interface Props {
  children: React.ReactNode;
}

const Dashboard = ({ children }: Props) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const router = useRouter();
  const [Notifications, setNotifications] = React.useState<any>(null)

  socket?.on('notificationEvent', (data) => {
    console.log("notificationEvent data :", data)
    setNotifications(data)
    setTimeout(() => {
      setNotifications(null)
    }
      , 1000)

  })

  const token: any = Cookies.get('token');
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
        Notifications && <MyToast  isOpen user={Notifications.sender.login} message={Notifications.message} />
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
