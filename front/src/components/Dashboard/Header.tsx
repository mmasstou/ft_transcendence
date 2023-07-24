'use client';
import Image from 'next/image';
import { RiNotification2Fill, RiSettingsLine } from 'react-icons/ri';
import logo from '../../../public/logo2.svg';
import MyAvatar from '../profile/MyAvatar';
import Link from 'next/link';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { useState } from 'react';
import Cookies from 'js-cookie';

export const Logout = () => {
  const logoutHandle = () => {
    Cookies.remove('token');
  }

  return (
    <div className=''>
      <div className='absolute down-arrow top-7 -right-3 z-20'></div>

      <div className="absolute text-white top-[68px] right-5 bg-[#2B504B] rounded-lg 
              w-24 h-20 md:w-34 md:h-24 xl:w-38 xl:h-26 z-20">
            <div className='flex flex-col justify-center items-center h-full'>
              <h3 className='mx-2'>aouhadou</h3>
              <div className='w-[5vw] border-b-[0.1vh] border-white opacity-50 my-1'></div>
                <ul className='list-none cursor-pointer'> 
                  <Link onClick={logoutHandle} href='/' className='flex justify-between items-center my-1'>
                    <RiLogoutBoxFill className='mx-2'/>
                    Logout
                  </Link>
                </ul>
          </div>
      </div>
    </div>
  )
}


const Header: React.FC = () : JSX.Element => {

  const [logout, setLogout] = useState<boolean>(false);
  const renderLogout = () => {
    setLogout(!logout);
  }

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
          <li>
          <div 
            onClick={renderLogout}
            className='w-[32px] h-[32px]'
          >
            <div className='cursor-pointer'><MyAvatar /></div>
            {logout && <Logout />}
          </div>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
