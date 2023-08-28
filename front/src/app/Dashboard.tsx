'use client';
import Header from '@/components/Dashboard/Header/Header';
import Sidebar from '@/components/Dashboard/sidebar/Sidebar';
import Login from '@/components/auth/modaLs/Login';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import ChanneLaccessDeniedModaL from './chat/channels/modaLs/channel.access.denied.modaL';
import ChanneLPasswordAccessModaL from './chat/channels/modaLs/channel.access.password.modaL';
import { useEffect } from 'react';
import ChanneLCreateModaL from './chat/channels/modaLs/channel.create.modaL';
import ChanneLSettingsModaL from './chat/channels/modaLs/channel.settings.modaL';
import io from 'socket.io-client';
import './dashboard.css';

interface Props {
  children: React.ReactNode;
}

const Dashboard = ({ children }: Props) => {
  const token: any = Cookies.get('token');
  // handle socket connection
  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notifications`, {
      auth: {
        token: `${token}`,
        id: `${Cookies.get('_id')}`,
      },
    });

    socket.on('connect', () => {
      console.log('socket connected');
    });

    socket.on('notification', (data) => {
      console.log(data);
      if (data.message === 'You have a new friend request.') {
        toast.success(data.message);
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after attempt ${attemptNumber}`);
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);
  // end handle socket connection

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
    return () => {
      return;
    };
  }, [token]);

  return (
    <>
      <Login />
      {/* <ChanneLModal /> */}
      <ChanneLPasswordAccessModaL />
      <ChanneLCreateModaL />
      <ChanneLSettingsModaL />
      <ChanneLaccessDeniedModaL />
      <div className="dashboard bg-primary overflow-y-auto">
        <header className="bg-transparent flex items-center justify-between px-5 ">
          <Header />
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
