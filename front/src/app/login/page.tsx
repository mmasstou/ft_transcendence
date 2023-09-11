'use client';
import Settings, { getUserData } from '@/components/Dashboard/Header/Settings';
import { userType } from '@/types/types';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

const Login = () => {
  const router = useRouter();
  const userId = Cookies.get('_id');
  const token = Cookies.get('token');
  const [authenticated, setAuthenticated] = useState<boolean>();
  const user: userType | null = getUserData();
  const [errMsg, setErrMsg] = useState<string>('');

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
          if (user?.isSecondFactorAuthenticated === true) {
            setErrMsg(
              "You don't have access to this page Two Factor Authentication is required."
            );
            setAuthenticated(false);
          } else {
            setAuthenticated(true);
          }
        }
        if (res.status === 401) {
          setErrMsg('You are not authorized.');
          setAuthenticated(false);
          console.clear();
        }
      } catch (error) {
        setAuthenticated(false);
        console.clear();
      }
    })();
  }, [token, userId, user]);

  const handleNotAuthenticated = () => {
    if (
      errMsg ===
      "You don't have access to this page Two Factor Authentication is required."
    ) {
      router.replace('/2fa');
      return;
    } else if (errMsg === 'You are not authorized.') {
      router.replace('/');
    }
  };
  return (
    <>
      {authenticated ? (
        <div className="bg-primary h-screen w-full overflow-y-scrol flex justify-center items-center">
          <Settings login={true} />
        </div>
      ) : authenticated === false ? (
        <div className="bg-primary h-screen w-full overflow-y-scrol flex justify-center items-center">
          <div
            className="bg-[#3E867C] w-4/ sm:w-1/2 min-h-[35vh] rounded-lg
            flex flex-col justify-center items-center gap-4 py-4"
          >
            <h1 className="text-[#D9D9D9] text-xl font-medium text-center">
              {errMsg ? errMsg : 'You are not authorized.'}
            </h1>
            <button
              onClick={handleNotAuthenticated}
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

export default Login;
