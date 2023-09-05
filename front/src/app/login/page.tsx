'use client';
import Settings from '@/components/Dashboard/Header/Settings';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

const Login = () => {
  // const router = useRouter();
  // const userId = Cookies.get('_id');
  // const token = Cookies.get('token');
  // if (!token || !userId) {
  //   router.replace('/');
  //   return null;
  // }
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
