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
    <div className='bg-[#243230] m-2 mt-5 rounded-[5px] text-white min-h-[250px] overflow-hidden flex justify-center items-center'>
        <Bar data={userData} />
        {/* <Pie data={userData} /> */}
    </div>
  )
}

export default Statistics