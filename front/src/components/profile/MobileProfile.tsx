import CoverUpload from '@/components/profile/CoverUpload';
import AvatarProfile from '@/components/profile/AvatarProfile';
import { UserInfo } from '@/components/profile/UserInfo';
import { UserStats } from '@/components/profile/UserStats';
import { Navbar } from '@/components/profile/Navbar';
import { userType } from '@/types/types';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { UpdateDataProvider } from '@/app/Dashboard';

function getUserData(): userType | null {
  const { updated, setUpdated } = UpdateDataProvider();
  const [user, setUser] = useState<userType | null>(null);

  useEffect(() => {
    const jwtToken = Cookies.get('token');
    const userId = Cookies.get('_id');
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
        console.log(error);
        return null;
      });
  }, [updated]);
  return user;
}

export const MobileProfile = (): JSX.Element => {
  const user = getUserData();
  return (
    <div className="flex flex-col ">
      <div className="bg-[#243230]">
        <CoverUpload />
        <AvatarProfile
          position="left-[7vw] top-[-5vh] w-[100px] h-[100px] border-2 rounded-full border-secondary"
          score="text-[0.875em] font-bold  h-[26px] w-[26px]"
          level={user?.Level}
        />
        <UserInfo user={user} />
        <UserStats user={user} />
      </div>
      <Navbar mobile={true} style="" />
    </div>
  );
};
