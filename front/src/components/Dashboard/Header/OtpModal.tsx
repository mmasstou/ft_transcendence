'use client';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  setOpenModal: (openModal: boolean) => void;
}

export const otpContext = React.createContext<Props | null>(null);

let currentOtpIndex: number = 0;
const Otp: React.FC<Props> = ({ setOpenModal }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
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
    if (otpSend.length !== 6) {
      toast.error('Please enter a valid otp code');
      return;
    }
    const userData = {
      twoFactorAuthenticationCode: otpSend,
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/2fa/authenticate`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${yourJwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          axios
            .post(
              `${process.env.NEXT_PUBLIC_BASE_URL}api/2fa/turn-on`,
              userData,
              {
                headers: {
                  Authorization: `Bearer ${yourJwtToken}`,
                  'Content-Type': 'application/json',
                },
              }
            )
            .then((response) => {
              if (response.status === 200) {
                toast.success('Two factor authentication enabled');
              }
            })
            .catch((err) => {
              if (err.response && err.response.status === 401) {
                toast.error(`${err.response.data.message}`);
                return;
              }
              return;
            })
            .finally(() => {
              setOtp(new Array(6).fill(''));
              setOpenModal(false);
            });
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setOtp(new Array(6).fill(''));
          toast.error(
            `${err.response.data.message} 🤔 Please try again or generate new Qr code`
          );
          return;
        }
        return;
      });
  };

  const handleQrCode = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/2fa/generate`, {
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
      <div className="flex justify-center items-center space-x-1 overflow-x-hidden">
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
  return (
    <>
      <div
        className="bg-[#3E867C] w-full min-h-full flex flex-col justify-center items-center
        gap-4 py-4 z-[999] rounded-lg twoFactor"
      >
        <Otp setOpenModal={setOpenModal} />
      </div>
    </>
  );
};

export default OtpModal;
