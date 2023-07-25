'use client';
import Image from 'next/image';
import { RiNotification2Fill, RiSettingsLine } from 'react-icons/ri';
import logo from '../../../public/logo2.svg';
import MyAvatar from '../profile/MyAvatar';
import Link from 'next/link';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';

export const Logout: React.FC = (props) : JSX.Element => {
  const [logout, setLogout] = useState<boolean>(false);
  let logoutRef = useRef<HTMLDivElement | null>(null);

  const renderLogout = () => {
    setLogout(!logout);
  };


  const logoutHandle = () => {

    Cookies.remove('token');
  }

  useEffect(() => {
    const handler = (e: any) => {
      if (logout && !logoutRef.current?.contains(e.target as Node)){
        setLogout(false);
      }
    };
    document.addEventListener("click", handler);

    return() => {
      document.removeEventListener("click", handler);
    }
  },[]);

  return (
    <div ref={logoutRef}>
      <div className='cursor-pointer w-[32px] h-[32px' onClick={renderLogout}><MyAvatar /></div>
        {logout &&
        // <div className='absolute down-arrow top-7 -right-3 z-20'></div> &&
          <div className="absolute text-white top-[68px] right-5 bg-[#2B504B] rounded-lg 
          w-54 h-[110px] z-20"  >
            <div className='flex flex-col justify-center items-center h-full' >
              <h3 className='mx-2'>👋 Hey, aouhadou</h3>
              <div className='w-2/3 border-b-[0.1vh] border-white opacity-50 my-2 ml-2'></div>
                <ul className='list-none cursor-pointer mt-2'> 
                  <Link onClick={logoutHandle} href='/'
                      className='flex justify-between items-center my-1 hover:text-red-700'>
                    <RiLogoutBoxFill className='mx-2'/>
                    Logout
                  </Link>
                </ul>
            </div>
          </div> 
        }
    </div>
  )
}


const Header: React.FC = () : JSX.Element => {
  return (
    <>
      <div className="flex justify-center items-center">
        <Image
          className="flex justify-center lg:w-[150px] xl:w-[150px] md:w-[150px] "
          src={logo}
          height={32}
          width={79}
          alt="Picture of the author"
          priority={false}
        />
      </div>
      <nav className="flex justify-center items-center">
        <ul className="flex items-center  gap-5 ">
          <li>
            <button className="">
              <RiSettingsLine size={32} color="#E0E0E0" />
            </button>
          </li>
          <li>
            <button>
              <RiNotification2Fill size={32} color="#E0E0E0" />
              
            </button>
          </li>
          <div>
              <Logout />
          </div>
        </ul>
      </nav>
    </>
  );
};

export default Header;
