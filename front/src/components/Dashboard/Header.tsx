"use client";
import logo from '../../../public/logo2.svg';
import Image from 'next/image';
import {CgProfile} from 'react-icons/cg';
import {RiSettingsLine, RiNotification2Fill} from 'react-icons/ri';

 
const Header = () => {
  return (
    <>
      <div className=" ml-5 md:ml-10 lg:ml-10 xl:ml-10">
        <Image
          className="flex justify-center lg:w-[150px] xl:w-[150px] md:w-[150px] "
          src={logo}
          height={32}
          width={79}
          alt="Picture of the author"
          priority={false}
        />
      </div>
      <nav className="flex justify-center mr-5 md:mr-10 lg:mr-10 xl:mr-10">
      <ul className="flex flex-row items-center ">
        <li >
          <button className="">
            <RiSettingsLine
            className="mr-6 w-[26px] h-[26px] lg:w-[32px] lg:h-[32px] xl:w-[32px] xl:h-[32px]
                      md:w-[32px] md:h-[32px]"
              color='#E0E0E0' 
            />
          </button>
        </li>
        <li>
        <button >
            <RiNotification2Fill
              className="mr-6 w-[26px] h-[26px] lg:w-[32px] lg:h-[32px] xl:w-[32px] xl:h-[32px]
              md:w-[32px] md:h-[32px]"
              color='#E0E0E0' 
            />
          </button>
        </li>
        <li>
        <button >
            <CgProfile
              className=" w-[26px] h-[26px] lg:w-[32px] lg:h-[32px] xl:w-[32px] xl:h-[32px]
              md:w-[32px] md:h-[32px]"
              color='#E0E0E0' 
            />
          </button>
        </li>
      </ul>
      </nav>
    </>
  )
}

export default Header
