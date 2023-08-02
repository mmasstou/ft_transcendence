"use client"
import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { UserData } from './Data';
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const Statistics = () => {
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.day),
    datasets: [
      {
        label: "Wins",
        data: UserData.map((data) => data.win),
      },
      {
        label: "Loses",
        data: UserData.map((data) => data.lose),
      },
    ],
  });

  return (
    <div className='bg-[#243230] flex justify-center rounded-md
          text-white lg:p-6'>
        <Bar data={userData} className='!w-[80%] !h-min' />
        {/* <Pie data={userData} /> */}
    </div>
  )
}

export default Statistics;