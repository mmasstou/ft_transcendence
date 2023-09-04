'use client';
import { userType } from '@/types/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import FriendCard from './FriendCard';

export function getFriendList(): userType[] {
  const [friendList, setFriendList] = React.useState<userType[]>([]);
  const jwtToken = Cookies.get('token');

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/friends/accepted`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const fetchedData: userType[] = response.data;
        setFriendList(fetchedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return friendList;
}

const Friend = () => {
  const friends: userType[] = getFriendList();

  return (
    <div className="bg-[#243230] rounded-md text-white flex flex-col p-2 xl:p-3 overflow-auto">
      {friends &&
        friends.map((friend) => (
          <FriendCard
            key={friend.id}
            login={friend.login}
            userId={friend.id}
            avatar={friend.avatar}
            status={friend.status}
            socket={undefined}
          />
        ))}
      {(!friends || friends.length === 0) && (
        <div className="text-center text-white">You have no friends yet</div>
      )}
    </div>
  );
};

export default Friend;
