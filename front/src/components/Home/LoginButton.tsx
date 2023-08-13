"use client";
import login42  from '../../../public/42_Logo.png';

interface ButtonProps {
    label: string,
    outline?: boolean,
    OnClick : () => void
}

const LoginButton = ({label, outline, OnClick} : ButtonProps) => {
  return (
    <button
    onClick={OnClick}
      className={`
        flex
        items-center justify-center mt-2
        p-2
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        xl:w-3/4 gl:w-3/4
        ${outline ? 'bg-white' : 'bg-[#48ecee]'}

      `}
    >
     <img src={login42.src} alt="Login Logo" className='h-[32px] w-[32px] mr-2'/> 
      {label}
    </button>
  )
}

export default LoginButton
