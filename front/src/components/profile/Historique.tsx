"use client"
import React from 'react'
import HistoriqueCard from './HistoriqueCard'

const Historique = () => {
  return (
    <div className='bg-[#243230] m-2 mt-5 rounded-[5px] text-white min-h-[200px] max-h-[40vh] md:min-h-[400px]
            lg:max-h-[56vh] md:max-h-[56vh] flex flex-col items-center px-2 overflow-y-auto overflow-x-hidden'>
      <HistoriqueCard />
    </div>
  )
}

export default Historique