'use client';
import Otp from '@/components/ui/otpField/Otp';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

const page = () => {
  const router = useRouter();
  const userId = Cookies.get('_id');
  const token = Cookies.get('token');
  const [authenticated, setAuthenticated] = useState<boolean>();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verifyUser`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status === 200) {
          setAuthenticated(true);
        }
        if (res.status === 401) {
          setAuthenticated(false);
          console.clear();
        }
      } catch (error) {
        setAuthenticated(false);
        console.clear();
      }
    })();
  }, [token, userId]);

  return (
    <>
      {authenticated ? (
        <div className="bg-primary h-screen w-full overflow-y-scrol flex justify-center items-center">
          <div
            className="bg-[#3E867C] w-4/ sm:w-1/2 min-h-[35vh] rounded-lg
            flex flex-col justify-center items-center gap-4 py-4"
          >
            <Otp />
          </div>
        </div>
      ) : authenticated === false ? (
        <div className="bg-primary h-screen w-full overflow-y-scrol flex justify-center items-center">
          <div
            className="bg-[#3E867C] w-4/ sm:w-1/2 min-h-[35vh] rounded-lg
            flex flex-col justify-center items-center gap-4 py-4"
          >
            <h1 className="text-[#D9D9D9] text-2xl font-bold">
              You are not authorized.
            </h1>
            <button
              onClick={() => {
                router.replace('/');
              }}
              className="bg-[#D9D9D9] text-[#3E867C] px-4 py-2 rounded-lg"
            >
              Go back
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-primary h-screen w-full overflow-y-scrol flex justify-center items-center">
          <h1 className="text-[#D9D9D9] text-2xl font-bold">
            Check login ....
          </h1>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default page;
