'use client';

import { useRouter } from 'next/navigation';

interface ButtonProps {
  label: string;
  outline?: boolean;
  OnClick: () => void;
}

const LoginButton = ({ label, outline, OnClick }: ButtonProps) => {
  const router = useRouter();

  const loginWithGoogle = async () => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <button
        onClick={OnClick}
        className={`
        flex items-center justify-center p-2
        relative
        disabled:opacity-70 disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        xl:w-3/4 gl:w-3/4
        ${outline ? 'bg-white' : 'bg-[#48ecee]'}

      `}
      >
        <img
          src={'/42_Logo.svg'}
          alt="Login Logo"
          className="h-[32px] w-[32px] mr-2"
        />
        {label}
      </button>
      <button
        onClick={loginWithGoogle}
        className={`
        flex
        items-center justify-center
        p-2
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        xl:w-3/4 gl:w-3/4
       bg-white

      `}
      >
        <img
          src={'/google.svg'}
          alt="Login Logo"
          className="h-[32px] w-[32px] mr-2"
        />
        Login With Google
      </button>
    </div>
  );
};

export default LoginButton;
