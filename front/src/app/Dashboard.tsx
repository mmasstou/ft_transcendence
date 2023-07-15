import { ReactElement } from 'react'
import  './dashboard.css'
import Header from '@/components/Dashboard/Header'
import Sidebar from '@/components/Dashboard/Sidebar'

interface Props {
    children: React.ReactNode,
}

const Dashboard = ({children} : Props) => {
  return (
    < >
    <div className= "dashboard bg-primary ">
      <header  className="bg-[#243230] flex items-center justify-between px-5 ">
       <Header/>
      </header>

      <main className=''>
        {children}
      </main>

      <div id="Sidebar">
        <Sidebar />
      </div>

    </div>
    </>
  )
}

export default Dashboard
