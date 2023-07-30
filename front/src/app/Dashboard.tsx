import React from 'react';
import './dashboard.css'
import Sidebar from '@/components/Dashboard/sidebar/Sidebar'
import Login from '@/components/auth/modaLs/Login'
import ChanneLModal from './chat/channels/modaLs/channel.modal'
import ChanneLCreateModaL from './chat/channels/modaLs/channel.create.modaL'
import ChanneLSettingsModaL from './chat/channels/modaLs/channel.settings.modaL'
import ChanneLaccessDeniedModaL from './chat/channels/modaLs/channel.access.denied.modaL'
import Header from '@/components/Dashboard/Header/Header'
interface Props {
  children: React.ReactNode;
}

const Dashboard = ({ children }: Props) => {
  return (
    <>
      <Login />
      {/* <ChanneLModal /> */}
      <ChanneLCreateModaL />
      <ChanneLSettingsModaL />
      <ChanneLaccessDeniedModaL />
      <div className="dashboard bg-primary">
        <header className="bg-transparent flex items-center justify-between px-5 ">
          <Header />
        </header>

        <main className="">{children}</main>

        <div id="Sidebar" className="">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
