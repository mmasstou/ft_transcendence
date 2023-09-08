import { socketContext } from '@/app/Dashboard';
import { userType } from '@/types/types';
import axios from 'axios';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Statistics from '../profile/Statistics';
import { UserInfo } from '../profile/UserInfo';
import { UserStats } from '../profile/UserStats';
import Button from './Button';
import banner from '@/../public/banner.jpeg';

interface ProfileProps {
  userId: string | undefined;
  handlePublicProfile: () => void;
}

const PublicProfile: React.FC<ProfileProps> = ({
  userId,
  handlePublicProfile,
}) => {
  const [user, setUser] = useState<userType | null>(null);

  useEffect(() => {
    const jwtToken = Cookies.get('token');
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
          setUser(response.data);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const contextValue = useContext(socketContext);
  const [friends, setfriends] = useState<any>([]);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
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
        if (friend.id === user?.id) {
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

  useEffect(() => {
    const token = Cookies.get('token');
    try {
      (async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/sendingrequests/all`,
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
          if (data.length > 0) {
            const userExits = data.some(
              (friend: { friendId: string | undefined }) => {
                if (friend.friendId === user?.id) {
                  return true;
                }
              }
            );
            if (userExits) {
              setIsPending(true);
            }
          }
        }
      })();
    } catch (error) {
      console.log('error in get friends: ', error);
    }
  }, [contextValue?.message, user]);

  const updateFriendState = (newState: boolean) => {
    setIsFriend(newState);
  };

  const updatePendingState = (newState: boolean) => {
    setIsPending(newState);
  };

  return (
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
      className="bg-[#2B504B] w-[90%] md:w-1/2 min-h-[100vh] fixed top-0 right-0 
      flex flex-col justify-start items-center gap-6 z-[999] bottom-0"
    >
      <div className="text-white w-full h-[300px] relative">
        {user?.banner ? (
          <Image
            src={user?.banner ? user.banner : ''}
            objectFit="cover"
            layout="fill"
            alt="Banner Image"
          />
        ) : (
          <Image
            src={banner}
            objectFit="cover"
            layout="fill"
            alt="Banner Image"
          />
        )}
        <div className="absolute -bottom-10 left-10">
          {user?.avatar ? (
            <Image
              className="rounded-full border border-secondary w-[120px] h-[120px]"
              src={user?.avatar ? user.avatar : ''}
              width={120}
              height={120}
              alt="avatar"
            />
          ) : (
            <div className="rounded-full border border-secondary w-[120px] h-[120px] bg-secondary"></div>
          )}
        </div>
      </div>
      <div className="w-full h-full">
        <UserInfo user={user} />
        <UserStats user={user} />

        <div className="flex justify-around items-center">
          <Button
            text="add friend"
            isFriend={isFriend}
            updateFriendState={updateFriendState}
            updatePendingState={updatePendingState}
            isPending={isPending}
            user={user}
          />
        </div>
        <div className="mx-4 mt-10 h-1/4">
          <Statistics user_id={user?.id} />
        </div>
      </div>
    </motion.div>
  );
};

export default PublicProfile;
