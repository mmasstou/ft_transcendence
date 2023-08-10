'use client';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { UserData } from './Data';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Statistics = () => {
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.day),
    datasets: [
      {
        label: 'Wins',
        data: UserData.map((data) => data.win),
      },
      {
        label: 'Loses',
        data: UserData.map((data) => data.lose),
      },
    ],
  });

  return (
    <div
      className="bg-[#243230] flex justify-center items-center m-2 mt-5 rounded-[5px] 
          text-white min-h-[250px] overflow-hidden lg:p-6 xl:p-6 2xl:p-6"
    >
      <Bar data={userData} />
    </div>
  );
};

export default Statistics;
