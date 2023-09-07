'use client';
import Cookies from 'js-cookie';
import CardRank from './CardRank';
import axios from 'axios';
import { userType } from '@/types/types';
import { useEffect, useState } from 'react';

function getAllUsers(): userType[] | null {
  const jwtToken = Cookies.get('token');
  const [users, setUsers] = useState<userType[] | null>(null);
  useEffect(() => {
    axios
      .get<userType[] | null>(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUsers(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return users;
}

const RankBoard = () => {
  const users: userType[] | null = getAllUsers();

  users?.sort((a, b) => {
    const userA = a.Level;
    const userB = b.Level;
    if (userA > userB) {
      return -1;
    } else if (userA < userB) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col mt-10 md:mx-4">
      <div className="flex flex-row justify-between items-center mx-6 md:mx-9 gap-10">
        <div className="flex flex-row justify-between gap-4 ">
          <h1 className="text-[1em] font-semibold text-[#D9D9D9] sm:text-[1.3em] sm:font-bold">
            Rank
          </h1>
          <h1 className="text-[1em] font-semibold text-[#D9D9D9] sm:text-[1.3em] sm:font-bold">
            Player
          </h1>
        </div>
        <div className="flex flex-row justify-between gap-4">
          <h1 className="text-[1em] font-semibold text-[#D9D9D9] sm:text-[1.3em] sm:font-bold">
            Wins
          </h1>
          <h1 className="text-[1em] font-semibold text-[#D9D9D9] sm:text-[1.3em] sm:font-bold">
            Level
          </h1>
        </div>
      </div>
      <div className="h-[100%]">
        {users?.map((user, index) => {
          return <CardRank key={user.id} user={user} rank={index + 1} />;
        })}
      </div>
    </div>
  );
};

export default RankBoard;
