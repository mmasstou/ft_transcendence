'use client';
import Settings from '@/components/Dashboard/Header/Settings';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const Login = () => {
  const router = useRouter();
  const userId = Cookies.get('_id');
  const token = Cookies.get('token');
  useEffect(() => {
    if (!token || !userId) {
      console.log('token or userId not found');
      router.replace('/');
      return;
    }
  }, []);
  return (
    <>
      <div className="bg-primary h-screen w-full overflow-y-scrol flex justify-center items-center">
        <Settings login={true} />
      </div>
      <Toaster />
    </>
  );
};

export default Login;
