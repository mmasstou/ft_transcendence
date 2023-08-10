'use client';
import Header from '@/components/Dashboard/Header/Header';
import Sidebar from '@/components/Dashboard/sidebar/Sidebar';
import Login from '@/components/auth/modaLs/Login';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ChanneLaccessDeniedModaL from './chat/channels/modaLs/channel.access.denied.modaL';
import ChanneLPasswordAccessModaL from './chat/channels/modaLs/channel.access.password.modaL';
import { useEffect } from 'react';
import ChanneLCreateModaL from './chat/channels/modaLs/channel.create.modaL';
import ChanneLSettingsModaL from './chat/channels/modaLs/channel.settings.modaL';
import './dashboard.css';
import OtpField from '@/components/ui/otpField/OtpField';

interface Props {
  children: React.ReactNode;
}

const Dashboard = ({ children }: Props) => {
  const router = useRouter();

  const token: any = Cookies.get('token');
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
