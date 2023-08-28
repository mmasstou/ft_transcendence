'use client';
import Settings from '@/components/Dashboard/Header/Settings';
import { Toaster } from 'react-hot-toast';

const Login = () => {
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
