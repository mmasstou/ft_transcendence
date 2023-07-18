import React, { useState } from 'react'
import MyAvatar from './MyAvatar'
import { RiRadioButtonLine } from 'react-icons/ri'
import { IoLogoGameControllerB } from 'react-icons/io';

interface btnProps {
    status: string;
    style: string;
    cursor: string;
};

const Button: React.FC<btnProps> = (props) => {
  return (
    <button className={`bg-transparen text-[10px] md:text-[16px w-[70px] sm:w-[80px] px-2 border 
            ${props.style} rounded-full ${props.cursor} flex justify-between items-center gap-1`}>
        {(props.status === 'ONLINE') && <RiRadioButtonLine />}
        {(props.status === 'IN GAME' || props.status === 'INVITE') && <IoLogoGameControllerB />}
        {(props.status === 'OFFLINE') && <RiRadioButtonLine />}

        {props.status}
    </button>
  )
}



const FriendCard : React.FC= () => {
    let status: string = 'IN GAME';
  return (
    <div className='bg-[#3E504D] hover:opacity-40 w-full h-[47px] flex mx-2 my-2 justify-between rounded-md 
            overflow-auto cursor-pointer ' >
        <div className='flex overflow-hidden items-center'>
            <div className='w-[37px] h-[37px] mx-2'>
                <MyAvatar/>
            </div>
            <span className='text-[14px] font-thin' >azouhadou</span>
        </div>
        <div className='flex px-1 py-4 items-center justify-center gap-1'>
            {(status === 'ONLINE') && 
                <Button status='INVITE' style='text-[#6CCCFE] border-[#6CCCFE]' cursor='cursor-pointer'/>
            }
            {(status === 'ONLINE') && 
                <Button status={status} style='text-secondary border-secondary' cursor='cursor-not-allowed' />
            }

            {(status === 'IN GAME') && 
                <Button status={status} style='text-[#ED6C03] border-[#ED6C03]' cursor='cursor-not-allowed' />
            }

            {(status === 'OFFLINE') && 
                <Button status={status} style='text-[#FFCC00] border-[#FFCC00]' cursor='cursor-not-allowed' />
            }

            

        </div>
    </div>
  )
}

export default FriendCard