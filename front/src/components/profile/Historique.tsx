"use client"
import React from 'react'
import HistoriqueCard from './HistoriqueCard'

const Historique = () => {
  return (
    <div className='bg-[#243230] m-2 mt-5 rounded-[5px] text-white min-h-[200px] max-h-[260px]
            flex flex-col items-center px-2 overflow-y-auto overflow-x-hidden'>
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
    </div>
  )
}

export default Historique