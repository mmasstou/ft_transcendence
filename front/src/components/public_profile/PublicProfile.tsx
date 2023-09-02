import { userType } from '@/types/types';
import Image from 'next/image';
import { UserInfo } from '../profile/UserInfo';
import { UserStats } from '../profile/UserStats';
import Statistics from '../profile/Statistics';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import Button from './Button';
import { socketContext } from '@/app/Dashboard';

interface ProfileProps {
  user: userType | null;
  handlePublicProfile: () => void;
}

const PublicProfile: React.FC<ProfileProps> = ({
  user,
  handlePublicProfile,
}) => {
  const contextValue = useContext(socketContext);
  const [friends, setfriends] = useState<any>([]);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: any) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      handlePublicProfile();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    try {
      (async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/friends/accepted`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setfriends(data);
        }
      })();
    } catch (error) {
      console.log('error in get friends: ', error);
    }
  }, [contextValue]);

  useEffect(() => {
    if (friends) {
      const friend = friends.find((friend: any) => {
        if (friend === user?.id) {
          return true;
        }
      });
      if (friend) {
        setIsFriend(true);
      }
    }
  }, [friends]);

  useEffect(() => {
    if (contextValue?.message === 'Your friend request has been accepted.') {
      setIsFriend(false);
    }
  }, [contextValue]);

  const updateFriendState = (newState: boolean) => {
    setIsFriend(newState);
  };

  console.log('in public isfrins: ', isFriend);
  console.log('contextValue: ', contextValue);

  return (
    <>
      <motion.div
        initial={{
          x: 500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        ref={profileRef}
        onClick={(event) => handleOutsideClick}
        className="bg-[#2B504B] w-[90%] md:w-1/2 h-full absolute top-0 right-0 
      flex flex-col justify-start items-center gap-6 z-[999]"
      >
        <div className="text-white w-full h-1/5  relative">
          {user?.banner ? (
            <Image
              src={user?.banner ? user.banner : ''}
              objectFit="cover"
              layout="fill"
              alt="Banner Image"
            />
          ) : (
            <div className="bg-[#243230] w-full h-full" />
          )}
          <div className="absolute -bottom-10 left-10">
            <Image
              className="rounded-full border-2 border-secondary w-[120px] h-[120px]"
              src={user?.avatar ? user.avatar : ''}
              width={120}
              height={120}
              alt="avatar"
            />
          </div>
        </div>
        <div className="w-full h-full">
          <UserInfo user={user} />
          <UserStats user={user} />

          <div className="flex justify-around items-center">
            <Button
              text="Message"
              user={user}
              updateFriendState={updateFriendState}
            />
            <Button
              text="add friend"
              isFriend={isFriend}
              updateFriendState={updateFriendState}
              user={user}
            />
          </div>
          <div className="mx-4 mt-10 h-1/4">
            <Statistics user_id={user?.id} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PublicProfile;
