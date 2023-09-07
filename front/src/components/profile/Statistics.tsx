'use client';
import React, { use, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Cookies from 'js-cookie';
import { HistoriqueType } from './Historique';
import axios from 'axios';

Chart.register(...registerables);

interface Props {
  user_id: string | undefined;
}

interface BackendData {
  created_at: string;
  id: string;
  player1Id: string;
  player1Score: number;
  player2Id: string;
  player2Score: number;
}

interface UserData {
  id: number;
  label: string;
  result: number;
}

const Statistics: React.FC<Props> = ({ user_id }) => {
  const jwtToken = Cookies.get('token');
  const [history, setHistory] = useState<HistoriqueType[]>([]);
  const [UserDataOld, setUserDataOld] = useState<UserData[]>([]);

  useEffect(() => {
    if (user_id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/game/GetScore/${user_id}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          const fetchedData: BackendData[] = response.data;

          if (fetchedData.length > 0) {
            const processedData = fetchedData.map((game: any) => {
              if (game.player1Id !== user_id) {
                let temp = game.player1Id;
                game.player1Id = game.player2Id;
                game.player2Id = temp;
                temp = game.player1Score;
                game.player1Score = game.player2Score;
                game.player2Score = temp;
              }
              return {
                created_at: game.created_at,
                id: game.id,
                PlayerId: game.player1Id,
                plyerScore: game.player1Score,
                oponentId: game.player2Id,
                oponentScore: game.player2Score,
              };
            });
            setHistory(processedData);
          }
        })
        .catch((error) => {
          console.log(error);
          return null;
        });
    }
  }, [user_id]);

  useEffect(() => {
    const oldData = history.map((match, index) => {
      const result = match.plyerScore - match.oponentScore;
      const id = index;
      return {
        id: id,
        label: result > 0 ? 'win' : 'lose',
        result: result,
      };
    });
    setUserDataOld(oldData);
  }, [history]);

  const [userDataNew, setUserDataNew] = useState<any>();
  useEffect(() => {
    const temp = {
      labels: UserDataOld.map((data) => data.id),
      datasets: [
        {
          label: 'Wins',
          data: UserDataOld.map((data) => {
            if (data.result > 0) return data.result;
            else return 0;
          }),
          barThickness: 30,
        },
        {
          label: 'Loses',
          data: UserDataOld.map((data) => {
            if (data.result < 0) return data.result;
            else return 0;
          }),
          barThickness: 30,
        },
      ],
    };
    setUserDataNew(temp);
  }, [UserDataOld]);

  const options = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      className="bg-[#243230] flex rounded-md justify-start md:justify-center min-h-[300px] p-2 xl:p-3
          text-white lg:max-h-[500px]"
    >
      {userDataNew?.labels.length > 0 && (
        <Bar
          data={userDataNew}
          className="sm:flex-1 w-full h-full"
          options={options}
        />
      )}
      {userDataNew?.labels.length === 0 && (
        <div className="flex justify-center items-center w-full h-full">
          <h1 className="text-2xl">No data to display</h1>
        </div>
      )}
    </div>
  );
};

export default Statistics;
