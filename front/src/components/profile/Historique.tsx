'use client';
import React from 'react';
import HistoriqueCard from './HistoriqueCard';
import Achievement from './Achievement';
const Historique = () => {
  return (
    <div
      className="bg-[#243230] rounded-md p-2 text-white min-h-[200px] max-h-[40vh] md:min-h-[400px]
            lg:max-h-[56vh] md:max-h-[56vh] flex flex-col items-center gap-2 lg:gap-3 overflow-y-auto overflow-x-hidden"
    >
      <HistoriqueCard />
    </div>
  );
};

export default Historique;
