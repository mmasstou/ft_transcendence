import React, { useState } from 'react';
import Link from "next/link"
import Cookies from 'js-cookie';
import Image from 'next/image';
import { userType } from '@/types/types';
import { formatDate } from '../channels/actions/formatDate';

export default function Conversation(props: { md: any }) {
    const [IsMounted, setIsMounted] = React.useState(false)
    const [user, setUser] = useState<userType>();
    const id = Cookies.get('_id');      

    React.useEffect(() => { 
        setIsMounted(true);
        setUser(props.md.User.filter((us: userType) => us.id !== id)[0]);
        console.log(props.md);
        console.log(user);
    }, [])

    if (!IsMounted) return
    return (
    <Link href={`/chat/${props.md.id}`} className=''>
        <div className='flex justify-start content-center items-center cursor-pointer py-[8px] px-[10px] mb-[5px] gap-4 bg-primary rounded-[30px]'>
            <Image src={user ? user?.avatar : ""} alt='User avatar' width={40} height={40} className='rounded-[50%]'/>
            <section className='flex justify-between items-center w-full mr-1'>
                <section className='flex flex-col justify-start'>
                    <h2 className='text-white '>{user?.login}</h2>
                    {/* <span className='text-[10px] text-[#3E504D]'>{formatDate(props.md.created_at)}</span> */}
                    <span className='text-[10px] text-[#3E504D]'>Creation Date</span>
                </section>
                <span className='text-xs text-[#1EF0AE]'>{user ? (user?.location ? user.location : 'Unavailable') : ''}</span>
            </section>
        </div>
    </Link>
    )
}