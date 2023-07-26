'use client';
import Image from 'next/image';
import { RiNotification2Fill, RiSettingsLine } from 'react-icons/ri';
import logo from '@/../public/logo2.svg'
import { Logout } from './Logout';
import Settings from './Settings';



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
          <Settings />
          <li>
            <button>
              <RiNotification2Fill size={32} color="#E0E0E0" />
            </button>
          </li>
            <Logout />
        </ul>
      </nav>
    </>
  );
};

export default Header;
