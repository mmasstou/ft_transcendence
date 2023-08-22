'use client';
import { DesktopProfile } from '@/components/profile/DesktopProfile';
import { MobileProfile } from '@/components/profile/MobileProfile';
import { useEffect, useState } from 'react';
import Dashboard from '../Dashboard';

const Profile = (): JSX.Element => {
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
      <Dashboard>{isMobile ? <MobileProfile /> : <DesktopProfile />}</Dashboard>
    </>
  );
};

export default Profile;
