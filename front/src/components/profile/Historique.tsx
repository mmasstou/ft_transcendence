import React from 'react';
import HistoriqueCard from './HistoriqueCard';
const Historique = () => {
  return (
    <div
      className="bg-[#243230] rounded-md text-white flex flex-col items-center gap-2 lg:gap-3 
          overflow-y-auto overflow-x-hidden max-h-[30vh] xl:max-h-[40vh] hitorique"
    >
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
      <HistoriqueCard />
    </div>
  );
};

export default Historique;
