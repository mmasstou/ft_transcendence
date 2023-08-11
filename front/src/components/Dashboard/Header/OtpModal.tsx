'use client';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  setOtpValue: (otpValue: string) => void;
  setOpenModal: (openModal: boolean) => void;
}

let currentOtpIndex: number = 0;
const Otp: React.FC<Props> = ({ setOtpValue, setOpenModal }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
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
    setOtpValue(otpSend);
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
          setOpenModal(false);
          toast.success('Two factor authentication enabled');
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          toast.error(
            `${err.response.data.message} 🤔 Please try again and don't forgor to scan Qr code first`
          );
          return;
        }
        return;
      })
      .finally(() => {
        setOtp(new Array(6).fill(''));
      });
  };

  const handleQrCode = () => {
    axios
      .get('http://localhost:80/api/2fa/generate', {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${yourJwtToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const srcImg = URL.createObjectURL(response.data);
          setQrCode(srcImg);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
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
                className={`w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold 
                        text-xl spin-button-none border-[#cccccc] focus:border-white 
                        focus:text-white text-[#cccccc] transition`}
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
        Please enter your passcode.
      </p>
      {qrCode ? (
        <div className="">
          <img src={qrCode} alt="" />
        </div>
      ) : (
        <p className="text-[#cccccc] text-center font-medium">
          generate{' '}
          <span
            onClick={handleQrCode}
            className="text-white cursor-pointer border-b font-semibold"
          >
            QR code
          </span>{' '}
          🕵️.
        </p>
      )}
      <button
        onClick={handlSave}
        className="border-2 border-secondary rounded-md w-1/2 p-2 text-secondary font-semibold hover:bg-secondary hover:text-white transition"
      >
        Save
      </button>
    </>
  );
};

interface OtpModalProps {
  setOpenModal: (openModal: boolean) => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ setOpenModal }) => {
  const [otpValue, setOtpValue] = useState<string>('');
  return (
    <>
      <div
        className="bg-[#3E867C] w-[40vw] min-h-[35vh] flex flex-col justify-center items-center
        gap-4 py-4 z-[999] rounded-lg twoFactor"
      >
        <Otp setOtpValue={setOtpValue} setOpenModal={setOpenModal} />
      </div>
    </>
  );
};

export default OtpModal;
