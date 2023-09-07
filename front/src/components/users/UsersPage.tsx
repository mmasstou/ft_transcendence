'use client';
import { User } from '@/app/game/[mode]/page';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
import UserCard from '../profile/FriendCard';
import { socketContext } from '@/app/Dashboard';

const UsersPage = () => {
  const contextValue = useContext(socketContext);
  const id = Cookies.get('_id');
  const token = Cookies.get('token');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/nonfriends`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-cache',
          }
        );
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [contextValue]);

  const handleAddfriend = async (id: string) => {
    const PostData = {
      receiverId: id,
    };
    if (PostData) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/friend-requests/send`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(PostData),
          }
        );
        if (response.ok) {
          console.log('ok');
        }
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="bg-[#243230] text-white rounded-md flex flex-col gap-4 items-center h-[90%] w-full px-2 py-4 xl:px-12 xl:py-8 m-2">
      <h1 className="text-3xl lg:text-4xl 2xl:text-5xl font-bold">
        Make new friends !
      </h1>
      <div className="h-full w-full lg:w-[90%] flex flex-col">
        {users.map((user) => {
          if (user.id !== id)
            return (
              <UserCard
                login={user.login}
                key={user.id}
                avatar={user.avatar}
                userId={user.id}
                addRequest
                addFriendFunc={handleAddfriend}
                status={user.status}
              />
            );
        })}
        {users.length === 0 && (
          <h1 className="text-2xl lg:text-3xl 2xl:text-4xl text-gray-400 text-center py-6 lg:py-12">
            No users found
          </h1>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
