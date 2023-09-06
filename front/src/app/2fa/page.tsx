'use client';
import Otp from '@/components/ui/otpField/Otp';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const page = () => {
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
        <div
          className="bg-[#3E867C] w-4/ sm:w-1/2 min-h-[35vh] rounded-lg
            flex flex-col justify-center items-center gap-4 py-4"
        >
          <Otp />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default page;
