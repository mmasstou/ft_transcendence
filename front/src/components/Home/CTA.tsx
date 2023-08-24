'use client';
import Image from 'next/image';
import { useState } from 'react';
import loginImg from '../../../public/login.png';
import Modal from '../modals/Modal';
import LoginButton from './LoginButton';
import styles from './style';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import getUserWithId from '@/app/chat/channels/actions/getUserWithId';
import getUserWithLogin from '@/app/chat/channels/actions/getUserWithLogin';
import { userType } from '@/types/types';

interface Btn {
  login: boolean;
  style: string;
  title: string;
  OnClick: () => void
}

const Button = ({ login, style, title, OnClick }: Btn) => {
  const [isOpen, setIsOpen] = useState(false);
  const [IsLoading, setLoading] = React.useState<boolean>(false)
  const [IsMounted, setMounted] = React.useState<boolean>(false)
  const [passwordInput, setpasswordInput] = React.useState("");
  const [usernameInput, setusernameInput] = React.useState("");

  const router = useRouter()

  React.useEffect(() => {
    setMounted(true)
    toast('open login')
  }, [])
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const Usernamewatch = watch('username')
  const passwordwatch = watch('password')
  // functions :
  const OnSubmit: SubmitHandler<FieldValues> = (data: any) => {
    toast(`LoggedUser ana hna`);
    (async () => {
      const LoggedUser: userType | null = await getUserWithLogin(data.username);
      toast(`LoggedUser ${LoggedUser?.login}`)
      if (!LoggedUser) return;
      if (LoggedUser.password === data.password) {
        toast('password match ..')
        router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/${LoggedUser.login}/${LoggedUser.password}`)
        // const LoginData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     username: LoggedUser.login,
        //     password: LoggedUser.password
        //   })
        // })
        // if (LoginData.ok) {
        //   toast(`${LoginData.status}`)
        //   const ddd = await LoginData.json();
        //   console.log("LoginData :", ddd)
        //   toast('okkkkß')
        //   setIsOpen(false)
        // }

      }
      // reset()
    })();
  }
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
            {title} ffff
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
          className={`flex justify-between items-center flex-col  min-h-[52vh]`}
        >
          {/* <h1
            className={`${styles.heading2} text-secondary flex justify-center `}
          >
            Login
          </h1> */}
          {/* <Image
            src={loginImg}
            width={250}
            height={500}
            alt="Login vector"
            priority={true}
          /> */}
          {/* <p className={`${styles.paragraph} text-[11px] lg:text[16px] p-2`}>
            You can login via these option klkkj :
          </p> */}

          <div className="flex flex-col gap-2 justify-center items-center w-full text-white">
            <h1 className=" flex w-full justify-center text-2xl">Welcome</h1>
            <h4 className="text-center text-sm">Login to continue to transcendence Dashboard</h4>
          </div>
          <div className='LoginWithUsername w-full flex flex-col items-center justify-center gap-4'>
            <div className="flex flex-col gap-4 w-full">
              <div className=" relative w-full">
                <input

                  id={'username'}
                  {...register('username', { required: true })}
                  placeholder=" "
                  type={'text'}
                  value={Usernamewatch}
                  onChange={(e) => setValue('username', e.target.value)}
                  disabled={IsLoading}
                  className={` text-white peer w-full p-2 pt-6 text-xl bg-transparent text-[var(--white)] focus:bg-transparent font-light border rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${errors['username'] ? 'border-rose-500 focus:border-rose-500' : 'border-neutral-300 focus:border-secondary'}`}
                />
                <label htmlFor="" className={`capitalize text-[var(--white)] absolute text-md duration-150 transform -translate-x-3 top-5 z-10 origin-[0] left-7 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${(Usernamewatch.length !== 0 || !Usernamewatch) ? 'scale-75 -translate-y-4' : ''} ${errors['username'] ? 'text-rose-500' : 'text-zinc-500'}`}>Login</label>
              </div>

              <div className=" relative w-full">
                <input
                  id={'password'}
                  {...register('password', { required: true })}
                  placeholder=" "
                  type={'password'}
                  value={passwordwatch}
                  onChange={(e) => setValue('password', e.target.value)}
                  disabled={IsLoading}
                  className={`peer w-full p-2 pt-6 text-xl bg-transparent text-[var(--white)] focus:bg-transparent font-light border rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${errors['password'] ? 'border-rose-500 focus:border-rose-500' : 'border-neutral-300 focus:border-[#2e519f]'}`}
                />
                <label htmlFor="" className={`text-[var(--white)] absolute text-md duration-150 transform -translate-x-3 top-5 z-10 origin-[0] left-7 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${(passwordwatch.length !== 0 || !passwordwatch) ? 'scale-75 -translate-y-4' : ''} ${errors['password'] ? 'text-rose-500' : 'text-zinc-500'}`}>password</label>
              </div>
            </div>
            <div className=" h-auto flex flex-col justify-end">
              {/* <Button  Nobg={true} W_full label="LogIn" onClick={() => {}} /> */}
              <button
                type={'submit'}
                onClick={handleSubmit(OnSubmit)}
                className={` relative flex gap-2 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 capitalize transition items-center w-full px-10 z-10 py-3 font-light text-sm bg-secondary`}>Login</button>
            </div>
          </div>
          <h2>Or</h2>
          <LoginButton OnClick={OnClick} label="Login kj With 42" />
        </div>
      </Modal>
    </>
  );
};

export default Button;
