'use client';
import { DesktopProfile } from '@/components/profile/DesktopProfile';
import { MobileProfile } from '@/components/profile/MobileProfile';
import { use, useEffect, useState } from 'react';
import Dashboard from '../Dashboard';
import { userType } from '@/types/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  DataProvider,
  useData,
} from '@/components/profile/context/DataContext';

function getUserData(): userType | null {
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
  }, []);
  return user;
}

interface Props {
  isMobile: boolean;
  user: userType | null;
}

const ProfileInfo: React.FC<Props> = ({
  user,
  isMobile,
}): JSX.Element => {

  return (
    <>
      {isMobile ? (
        <MobileProfile user={user} />
      ) : (
        <DesktopProfile user={user} />
      )}
    </>
  );
};

const Profile = (): JSX.Element => {
  const user = getUserData();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth <= 767);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <DataProvider>
        <Dashboard>
          <ProfileInfo
            user={user}
            isMobile={isMobile}
          />
        </Dashboard>
      </DataProvider>
    </>
  );
};

export default Profile;
