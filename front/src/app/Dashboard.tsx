import { ReactElement } from 'react'
import  './dashboard.css'
import Header from '@/components/Dashboard/Header'
import Sidebar from '@/components/Dashboard/sidebar/Sidebar'
import Login from '@/components/auth/modaLs/Login'
import ChanneLModal from './chat/channels/modaLs/channel.modal'
import ChanneLCreateModaL from './chat/channels/modaLs/channel.create.modaL'
interface Props {
    children: React.ReactNode,
}

const Dashboard = ({children} : Props) => {
  return (
    <>
    <Login/>
    {/* <ChanneLModal /> */}
    <ChanneLCreateModaL />
    <div className= "dashboard bg-primary">
      <header  className="bg-transparent flex items-center justify-between px-5 ">
       <Header/>
      </header>

      <main className="">
        {children}
      </main>

      <div id="Sidebar" className="">
        <Sidebar />
      </div>

    </div>
    </>
  )
}

export default Dashboard
