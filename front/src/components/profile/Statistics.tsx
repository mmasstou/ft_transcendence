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
      className="bg-[#243230] flex rounded-md justify-center h-[300px] md:h-[400px] xl:h-[700px] p-2 xl:p-3
          text-white"
    >
      <Bar data={userData} className="sm:flex-1" />
    </div>
  );
};

export default Statistics;
