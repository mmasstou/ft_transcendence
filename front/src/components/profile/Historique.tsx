'use client';
import HistoriqueCard from './HistoriqueCard';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export interface HistoriqueType {
  created_at: string;
  id: string;
  PlayerId: string;
  plyerScore: number;
  oponentId: string;
  oponentScore: number;
}

interface BackendData {
  created_at: string;
  id: string;
  player1Id: string;
  player1Score: number;
  player2Id: string;
  player2Score: number;
}

const Historique = () => {
  const jwtToken = Cookies.get('token');
  const userId = Cookies.get('_id');
  const [history, setHistory] = useState<HistoriqueType[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/game/GetScore/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const fetchedData: BackendData[] = response.data;

        if (fetchedData.length > 0) {
          const processedData = fetchedData.map((game: any) => {
            if (game.player1Id !== userId) {
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
  }, []);

  return (
    <div
      className="bg-[#243230] m-2 rounded-md text-white flex flex-col items-center gap-2 lg:gap-3 
          px-2 py-2 md:px-4 md:py-4 min-h-[30vh] max-h-[50vh] md:max-h-[60vh] overflow-y-auto overflow-x-hidden"
    >
      {history.length > 0 ? (
        history.map((match) => {
          return <HistoriqueCard key={match.id} game={match} />;
        })
      ) : (
        <div className="flex justify-center items-center ">
          <span className="text-[1em] lg:text-[1.5em] font-semibold text-white mx-2 lg:mx-4">
            No history yet
          </span>
        </div>
      )}
    </div>
  );
};

export default Historique;
