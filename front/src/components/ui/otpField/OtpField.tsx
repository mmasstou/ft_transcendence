'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

interface Props {}

let currentOtpIndex: number = 0;
const Otp: React.FC<Props> = () => {
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

  const handlSave = () => {
    console.log(otp.toString().replace(/,/g, ''));
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtp]);

  return (
    <>
      <div className="flex justify-center items-center space-x-1">
        {otp.map((_, index) => {
          return (
            <React.Fragment key={index}>
              <input
                ref={index === activeOtp ? inputRef : null}
                type="number"
                className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl spin-button-none border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
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
      <button onClick={handlSave} className="text-black border-1  p-2">
        Save
      </button>
    </>
  );
};

const OtpField = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-violet11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none">
          Edit profile
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Edit profile
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
          <Otp />
          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                Save changes
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default OtpField;
