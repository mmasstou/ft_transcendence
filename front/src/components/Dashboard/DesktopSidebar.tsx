"use client"
import { usePathname } from "next/navigation"
import {CgProfile} from 'react-icons/cg';
import {AiFillWechat} from 'react-icons/ai';
import {FaUsers} from 'react-icons/fa';
import {IoLogoGameControllerB} from 'react-icons/io';
import MenuItem from "./sidebar/MenuItem"

const DesktopSidebar = () => {
    const router = usePathname();

  return (
      <nav className="flex flex-col justify-between items-center">
            <div className="">
                <ul className="mt-10">
                    <MenuItem isActive={router === '/profile'} href='/profile' icon={CgProfile}/>
                    <MenuItem isActive={router === '/chat'} href='/chat' icon={AiFillWechat}/>
                    <MenuItem isActive={router === '/users'} href='/users' icon={FaUsers}/>
                    <MenuItem isActive={router === '/game'} href='/game' icon={IoLogoGameControllerB}/>
                </ul>
            </div>
        </nav>
  )
}

export default DesktopSidebar
