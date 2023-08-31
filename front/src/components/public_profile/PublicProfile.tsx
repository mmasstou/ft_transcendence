import { userType } from '@/types/types';
import Image from 'next/image';
import { UserInfo } from '../profile/UserInfo';
import { UserStats } from '../profile/UserStats';
import Statistics from '../profile/Statistics';
import { BsSend } from 'react-icons/bs';
import { BiUserPlus, BiUserX } from 'react-icons/bi';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { MdPendingActions } from 'react-icons/md';

interface ProfileProps {
  user: userType | null;
  handlePublicProfile: () => void;
}

interface ButtonProps {
  text: string;
  user?: userType | null;
  isFriend?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, user, isFriend }) => {
  const token = Cookies.get('token');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [pending, setPending] = useState<any>([]);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);

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
          setPending(data);
        }
      })();
    } catch (error) {
      console.log('error in get pending request: ', error);
    }
  }, [isSent]);

  const sendFriendRequest = async () => {
    const PostData = {
      receiverId: user?.id,
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
          setIsSent(true);
        }
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  const removeFrined = async () => {
    const PostData = {
      friendId: user?.id,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/removefriend`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(PostData),
        }
      );
      if (response.ok) {
        setIsRemoved(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFriendRequest = async () => {
    if (!isFriend) {
      sendFriendRequest();
    } else {
      removeFrined();
    }
  };

  useEffect(() => {
    if (pending.length > 0) {
      setIsPending(true);
    }
  }, [pending]);

  console.log('pending: ', pending);

  return (
    <>
      {text === 'Message' ? (
        <button
          className="flex justify-evenly items-center border-2 border-[#D9D9D9] rounded-full
     p-2 text-[#D9D9D9] hover:opacity-70 w-[10rem]"
        >
          <BsSend />
          <span>{text}</span>
        </button>
      ) : (
        <button
          onClick={handleFriendRequest}
          disabled={isPending}
          className="flex justify-evenly items-center border-2 border-[#D9D9D9] rounded-full
     p-2 text-[#D9D9D9] hover:opacity-70 w-[10rem]"
        >
          {isPending ? (
            <>
              <MdPendingActions />
              <span>Pending Request</span>
            </>
          ) : isFriend && !isRemoved ? (
            <>
              <BiUserX />
              <span>Remove Friend</span>
            </>
          ) : (
            <>
              <BiUserPlus />
              <span>Add Friend</span>
            </>
          )}
        </button>
      )}
    </>
  );
};

const PublicProfile: React.FC<ProfileProps> = ({
  user,
  handlePublicProfile,
}) => {
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
  }, []);

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
          duration: 1,
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
            <Button text="Message" user={user} />
            {isFriend ? (
              <Button text="Remove Friend" user={user} isFriend={isFriend} />
            ) : (
              <Button text="Add Friend" user={user} isFriend={isFriend} />
            )}
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
