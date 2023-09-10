'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
('react-hook-form');
import toast from 'react-hot-toast';
import Modal from '../modals/Modal';
import LoginButton from './LoginButton';
import Image from 'next/image';
import Login from '../../../public/login.png';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

interface Btn {
  login: boolean;
  style: string;
  title: string;
  OnClick: () => void;
}

const Button = ({ login, style, title, OnClick }: Btn) => {
  const [isOpen, setIsOpen] = useState(false);
  const [IsMounted, setMounted] = React.useState<boolean>(false);

  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
    toast('open login');
  }, []);

  if (!IsMounted) return;
  return (
    <>
      {/* <div className={` w-full lg:flex lg:justify-start xl:flex xl:flex-start`}>
        {login ? (
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            className={`rounded-full text-btn bg-secondary
                  ${style} w-[100px] h-[32px] lg:w-[120px] lg:h-[42px] mr-6 mt-5`}
          >
            {title}
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            className={`rounded-full ${style}  
                  w-[170px] h-[42px] mr-6 mt-5 mb-10`}
          >
            {title}
          </button>
        )}
      </div>
      <Modal isVisible={isOpen} onClose={() => setIsOpen(false)}>
        <div
          className={`flex justify-around items-center flex-col h-full min-h-[720px]`}
        >
          <div className="">
            <Image
              src={Login}
              width={350}
              height={700}
              alt="login image"
              priority
            />
          </div>
          <LoginButton OnClick={OnClick} label="Login With 42" />
        </div>
      </Modal> */}

      <Dialog.Root>
        <Dialog.Trigger asChild>
          {login ? (
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className={`rounded-full text-btn bg-secondary
                  ${style} w-[100px] h-[32px] lg:w-[120px] lg:h-[42px] mr-6 mt-5`}
            >
              {title}
            </button>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className={`rounded-full ${style}  
                  w-[170px] h-[42px] mr-6 mt-5 mb-10`}
            >
              {title}
            </button>
          )}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#2B504B] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50">
            <Dialog.Title className="text-white m-0 text-[17px] font-medium text-center">
              Sign In
            </Dialog.Title>
            <Dialog.Description className="text-[#d4d4d4d4] mt-[10px] mb-5 text-[15px] leading-normal text-center">
              With
            </Dialog.Description>
            <LoginButton OnClick={OnClick} label="Login With 42" />
            <Dialog.Close asChild>
              <button
                className="text-secondary hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default Button;
