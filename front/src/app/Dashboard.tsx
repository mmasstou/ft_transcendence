'use client';
import React, { useEffect } from 'react';
import './dashboard.css';
import Sidebar from '@/components/Dashboard/sidebar/Sidebar';
import Login from '@/components/auth/modaLs/Login';
import './dashboard.css';
import { Toaster } from 'react-hot-toast';
import ChanneLModal from './chat/channels/modaLs/channel.modal';
import ChanneLCreateModaL from './chat/channels/modaLs/channel.create.modaL';
import ChanneLSettingsModaL from './chat/channels/modaLs/channel.settings.modaL';
import ChanneLaccessDeniedModaL from './chat/channels/modaLs/channel.access.denied.modaL';
import Header from '@/components/Dashboard/Header/Header';
import ChanneLPasswordAccessModaL from './chat/channels/modaLs/channel.access.password.modaL';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ChanneLFindRoommodaL from './chat/channels/modaLs/channel.find.room.modaL';
import { Socket, io } from 'socket.io-client';
interface Props {
  children: React.ReactNode;
}

const Dashboard = ({ children }: Props) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const router = useRouter();
  const token: any = Cookies.get('token');
  if (!token) {
    router.push('/');
    return null;
  }

  useEffect(() => {

    const socket: Socket = io(`${process.env.NEXT_PUBLIC_USERSOCKET_URL_WS}`, {
        auth: {
            token: `${token}`,
            id: `${Cookies.get("_id")}`
        }
    });
    setSocket(socket);

    // const messageSocket: messageSocket = {
    //     roomId: roomid,
    //     messageContent: message
    // }
    // // if (message) {

    // socket && socket.emit("sendMessage", messageSocket, () => setmessages(""));
    socket && socket.on("connected", (data) => {
        
    })


    return () => {
        socket && socket.disconnect();
    };

}, [])
  return (
    <>
      <Login />
      {/* <ChanneLModal /> */}
      <ChanneLPasswordAccessModaL />
      <ChanneLCreateModaL />
      <ChanneLSettingsModaL />
      <ChanneLFindRoommodaL />
      <ChanneLaccessDeniedModaL />
      <div className="dashboard bg-primary">
        <header className="bg-transparent flex items-center justify-between px-5 ">
          <Header socket={socket}  />
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
