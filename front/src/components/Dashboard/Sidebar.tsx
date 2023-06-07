"use client";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from "react";
import {CgProfile} from 'react-icons/cg';
import {AiFillWechat} from 'react-icons/ai';
import {FaUsers} from 'react-icons/fa';
import {IoLogoGameControllerB} from 'react-icons/io';
import MenuItem from './MenuItem';

const Sidebar = () => {
    const router = usePathname();
  
      return (
        <div className="fixed bottom-0 bg-[#243230] h-[5rem] w-full px-6 rounded-t-xl md:hidden">
            <div className="relative top-5 h-full ">
                <ul className="flex flex-row justify-around items-center">
                    <MenuItem isActive={router === '/profile'} href='/profile' icon={CgProfile}/>
                    <MenuItem isActive={router === '/chat'} href='/chat' icon={AiFillWechat}/>
                    <MenuItem isActive={router === '/users'} href='/users' icon={FaUsers}/>
                    <MenuItem isActive={router === '/game'} href='/game' icon={IoLogoGameControllerB}/>
                </ul>
            </div>
        </div>
      );
}

export default Sidebar
