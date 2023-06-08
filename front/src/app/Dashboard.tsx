import { ReactElement } from 'react'
import  './dashboard.css'
import Header from '@/components/Dashboard/Header'
import Sidebar from '@/components/Dashboard/sidebar/Sidebar'
interface Props {
    children: React.ReactNode,
}

const Dashboard = ({children} : Props) => {
  return (
    <>
    <div className= "dashboard bg-primary">
      <header  className="bg-transparent flex items-center justify-between ">
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
