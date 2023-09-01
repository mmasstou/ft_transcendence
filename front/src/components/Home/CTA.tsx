'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../modals/Modal';
import LoginButton from './LoginButton';

interface Btn {
  login: boolean;
  style: string;
  title: string;
  OnClick: () => void
}

const Button = ({ login, style, title, OnClick }: Btn) => {
  const [isOpen, setIsOpen] = useState(false);
  const [IsMounted, setMounted] = React.useState<boolean>(false)


  const router = useRouter()

  React.useEffect(() => {
    setMounted(true)
    toast('open login')
  }, [])

  if (!IsMounted) return;
  return (
    <>
      <div className={` w-full lg:flex lg:justify-start xl:flex xl:flex-start`}>
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
        <div className={`flex justify-around items-center flex-col h-full min-h-[720px]`}>
          <LoginButton OnClick={OnClick} label="Login kj With 42" />
        </div>
      </Modal>
    </>
  );
};

export default Button;
