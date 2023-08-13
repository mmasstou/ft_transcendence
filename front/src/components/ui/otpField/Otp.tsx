'use client';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {}

let currentOtpIndex: number = 0;
const Otp: React.FC<Props> = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [activeOtp, setActiveOtp] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnCnage = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target;
    const newOtp: string[] = [...otp];
    newOtp[currentOtpIndex] = value.substring(value.length - 1);
    if (!value) setActiveOtp(currentOtpIndex - 1);
    else setActiveOtp(currentOtpIndex + 1);

    setOtp(newOtp);
  };

  const handleKeyDown = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOtpIndex = index;
    if (key === 'Backspace') {
      setActiveOtp(currentOtpIndex - 1);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtp]);

  const yourJwtToken = Cookies.get('token');

  const handlSave = () => {
    const otpSend = otp.toString().replace(/,/g, '');
    const userData = {
      twoFactorAuthenticationCode: otpSend,
    };
    axios
      .post('http://localhost:80/api/2fa/authenticate', userData, {
        headers: {
          Authorization: `Bearer ${yourJwtToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          router.push('/profile');
          toast.success('Your profile is verified');
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          toast.error(err.response.data.message);
          return;
        }
        return;
      })
      .finally(() => {
        setOtp(new Array(6).fill(''));
      });
  };

  return (
    <>
      <h1 className="text-white font-bold">Hi, Aouhadou</h1>
      <p className="text-[#cccccc] w-2/5 text-center font-medium">
        Authorization is required to access your profile.🔒
      </p>
      <div className="flex justify-center items-center space-x-1">
        {otp.map((_, index) => {
          return (
            <React.Fragment key={index}>
              <input
                ref={index === activeOtp ? inputRef : null}
                type="number"
                className={`w-8 h-8 md:w-12 md:h-12 border-2 bg-transparent outline-none text-center font-semibold 
                text-xl spin-button-none border-[#cccccc] focus:border-white 
                focus:text-white text-[#cccccc] transition rounded-md`}
                onChange={handleOnCnage}
                onKeyDown={(e) => handleKeyDown(e, index)}
                value={otp[index]}
              />
              {index === otp.length - 1 ? null : (
                <span className="w-2 py-0.5 bg-gray-400" />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="text-[#cccccc] text-center font-medium">
        Please enter your OtpCod.
      </p>

      <button
        onClick={handlSave}
        className="border-2 border-secondary rounded-md w-1/2 p-2 text-secondary font-semibold hover:bg-secondary hover:text-white transition"
      >
        Save
      </button>
    </>
  );
};

export default Otp;
