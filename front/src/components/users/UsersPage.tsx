'use client';
import { UserCardProps } from '@/types/UserCardTypes';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import UserCard from '../profile/FriendCard';

const UsersPage = () => {
  const [users, setUsers] = useState<UserCardProps[]>([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setUsers(response.data);
      });
  }, [setUsers]);

  return (
    <div className="bg-[#243230] text-white rounded-md flex flex-col gap-4 items-center h-[90%] w-full px-2 py-4 xl:px-12 xl:py-8 m-2">
      <h1 className="text-3xl lg:text-4xl 2xl:text-5xl font-bold">
        Make new friends !
      </h1>
      <div className="h-full w-full lg:w-[90%] flex flex-col">
        {users.map((user, i) => (
          <UserCard
            login={user.login}
            key={i}
            avatar={user.avatar}
            userId={user.userId}
            addRequest
            addFriendFunc={() => {
              // add friend function
            }}
            status={user.status}
            mode=""
            socket={null}
          />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
