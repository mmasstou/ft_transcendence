import MyAvatar from './MyAvatar';
import { HistoriqueType } from './Historique';
import Cookies from 'js-cookie';
import { userType } from '@/types/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import style from '../Home/style';

interface Props {
  game: HistoriqueType;
}

const HistoriqueCard: React.FC<Props> = (game) => {
  const userId = Cookies.get('_id');
  const jwtToken = Cookies.get('token');
  const [playerInfo, setPlayerInfo] = useState<userType | null>();
  const [opponentInfo, setOpponentInfo] = useState<userType | null>();
  useEffect(() => {
    if (game.game.PlayerId === userId) {
      axios
        .get<userType | null>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setPlayerInfo(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
          return null;
        });
    }
    if (game.game.oponentId !== userId) {
      axios
        .get<userType | null>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${game.game.oponentId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setOpponentInfo(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
          return null;
        });
    }
  }, []);

  return (
    <div className="bg-[#3E504D]  w-full flex justify-between py-3 lg:py-4 rounded-md">
      <div className="flex flex-col overflow-hidden items-center justify-center lg:mx-8">
        <div className="w-[28px] h-[28px] lg:h-[45px] lg:w-[45px] xl:h-[60px] xl:w-[60px] mx-2">
          <MyAvatar />
        </div>
        <span className="text-[0.625em] lg:text-[1em] font-semibold text-white mx-2 lg:mx-4">
          {playerInfo?.login}
        </span>
      </div>

      <div className="flex items-center cursor-default">
        <div
          className={`bg-transparent text-secondary flex justify-center items-center gap-2 border rounded-full border-secondary 
                            text-[1em] md:text-[1em] lg:text-[1.5em] xl:text-[1.5em] 2xl:text-[1.5em]
                            px-2 md:px-10 md:py-2 lg:px-10 lg:py-2 xl:px-10 xl:py-2 2xl:px-10 2xl:py-2
                `}
        >
          <span className="font-semibold">{game.game.plyerScore}</span>{' '}
          <span className="font-semibold">VS</span>{' '}
          <span className="font-semibold">{game.game.oponentScore}</span>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden items-center justify-center lg:mx-8">
        <div className="w-[28px] h-[28px] lg:h-[45px] lg:w-[45px] xl:h-[60px] xl:w-[60px] mx-2">
          <Avatar.Root
            className={`${style.flexCenter} flex-inline align-middle overflow-hidden select-none
            rounded-full w-full h-full`}
          >
            <Avatar.Image
              className="w-full h-full object-cover border-secondary rounded-full"
              src={opponentInfo?.avatar}
              sizes="100%"
              alt="User Avatar"
            />
          </Avatar.Root>
        </div>
        <span className="text-[0.625em] lg:text-[1em] font-semibold text-white mx-2 lg:mx-4">
          {opponentInfo?.login}
        </span>
      </div>
    </div>
  );
};

export default HistoriqueCard;
