"use client";
import logo from '../../../public/logo2.svg';
import Image from 'next/image';
import { CgProfile } from 'react-icons/cg';
import { RiSettingsLine, RiNotification2Fill } from 'react-icons/ri';


const Header = () => {
  return (
    <>
      <div className="">
        <Image
          className="flex justify-center lg:w-[150px] xl:w-[150px] md:w-[150px] "
          src={logo}
          height={32}
          width={79}
          alt="Picture of the author"
          priority={false}
        />
      </div>
      <nav className="flex justify-center ">
        <ul className="flex flex-row items-center  gap-5 ">
          <li >
            <button className="">
              <RiSettingsLine
                size={32}
                color='#E0E0E0'
              />
            </button>
          </li>
          <li>
            <button >
              <RiNotification2Fill
               size={32}
                color='#E0E0E0'
              />
            </button>
          </li>
          <li>
            <button >
              <CgProfile
                size={32}
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
