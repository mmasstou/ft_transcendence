'use client';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import MyAvatar from '@/components/profile/MyAvatar';
import { useRouter } from 'next/navigation';

export const Logout: React.FC = (props) : JSX.Element => {
  const [logout, setLogout] = useState<boolean>(false);
  let logoutRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const renderLogout = () => {
    setLogout(!logout);
  };


  const logoutHandle = () => {
    (async () => {
      const resp = await fetch('http://localhost:80/api/auth/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      if (resp.status === 200) {
        Cookies.remove('token');
        Cookies.remove('_id');
        router.push('/')
        
      }
    })();
  }

  useEffect(() => {
    const handler = (e: any) => {
      if (logout && !logoutRef.current?.contains(e.target as Node)){
        setLogout(logout => !logout);
      }
    };
    document.addEventListener("click", handler);

    return() => {
      document.removeEventListener("click", handler);
    }
  },);
 
  return (
    <div ref={logoutRef}>
      <div className='cursor-pointer w-[32px] h-[32px' onClick={renderLogout}><MyAvatar /></div>
      {logout && <div className='absolute down-arrow top-7 -right-3 z-20'></div> }
        {logout &&
          <div className="absolute text-white top-[68px] right-5 bg-[#2B504B] rounded-lg 
          w-54 h-[110px] z-20"  >
            <div className='flex flex-col justify-center items-center h-full' >
              <h3 className='mx-2'>👋 Hey, aouhadou</h3>
              <div className='w-3/4 border-b-[0.1vh] border-white opacity-50 my-2 ml-2'></div>
                <ul className='list-none cursor-pointer mt-2'> 
                  <button onClick={logoutHandle} className='flex justify-between items-center my-1 hover:text-red-500'>
                  <RiLogoutBoxFill className='mx-2'/>
                    Logout
                  </button>
                </ul>
            </div>
          </div> 
        }
    </div>
  )
}