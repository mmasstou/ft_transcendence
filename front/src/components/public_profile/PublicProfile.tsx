import { userType } from '@/types/types';
import Image from 'next/image';
import { UserInfo } from '../profile/UserInfo';
import { UserStats } from '../profile/UserStats';
import Statistics from '../profile/Statistics';
import { BsSend } from 'react-icons/bs';
import { BiUserPlus, BiUserX } from 'react-icons/bi';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface ProfileProps {
  user: userType | null;
  handlePublicProfile: () => void;
}

interface ButtonProps {
  text: string;
  block?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, block }) => {
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
          className="flex justify-evenly items-center border-2 border-[#D9D9D9] rounded-full
     p-2 text-[#D9D9D9] hover:opacity-70 w-[10rem]"
        >
          {block ? <BiUserX /> : <BiUserPlus />}
          <span>{text}</span>
        </button>
      )}
    </>
  );
};

const PublicProfile: React.FC<ProfileProps> = ({
  user,
  handlePublicProfile,
}) => {
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
          <Image
            src={user?.banner ? user.banner : ''}
            objectFit="cover"
            layout="fill"
            alt="Banner Image"
          />
          <div className="absolute -bottom-10 left-10">
            <Image
              className="rounded-full border-2 border-secondary w-[120px] h-[120px]"
              src={user?.avatar ? user.avatar : ''}
              width={120}
              height={120}
              alt="leaderboard icon"
            />
          </div>
        </div>
        <div className="w-full h-full">
          <UserInfo user={user} />
          <UserStats user={user} />

          <div className="flex justify-around items-center">
            <Button  text="Message" />
            <Button text="Add Friend" block={false} />
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
