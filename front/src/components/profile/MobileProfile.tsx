'use client';
import ImageUpload from '@/components/profile/CoverUpload';
import AvatarProfile from '@/components/profile/AvatarProfile';
import { UserInfo } from '@/components/profile/UserInfo';
import { UserStats } from '@/components/profile/UserStats';
import { Navbar } from '@/components/profile/Navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Info } from '@/app/profile/page';

export const MobileProfile = (): JSX.Element => {
  const [user, setUser] = useState<Info | null>();
  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((userData) => setUser(userData.data[0]))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="flex flex-col ">
      <div className="bg-[#243230]">
        <ImageUpload />
        <AvatarProfile
          position="left-[7vw] top-[-5vh] w-[100px] h-[100px] border-2 rounded-full border-secondary"
          score="text-[0.875em] font-bold  h-[26px] w-[26px]"
        />
        <UserInfo user={user} />
        <UserStats />
      </div>
      <Navbar mobile={true} style="" />
    </div>
  );
};
