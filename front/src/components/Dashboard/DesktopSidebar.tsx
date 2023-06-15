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
      <nav className="flex flex-col justify-between items-center h-full p-1">
            <ul className="flex flex-col justify-center items-center gap-12 w-full h-full">
                <MenuItem isActive={router === '/profile'} href='/profile' icon={CgProfile}/>
                <MenuItem isChat isActive={router === '/chat'} href='/chat' icon={AiFillWechat}/>
                <MenuItem isActive={router === '/users'} href='/users' icon={FaUsers}/>
                <MenuItem isActive={router === '/game'} href='/game' icon={IoLogoGameControllerB}/>
            </ul>
        </nav>
  )
}

export default DesktopSidebar
