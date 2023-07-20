"use client"
import ImageUpload from '@/components/profile/ImageUpload'
import AvatarProfile from '@/components/profile/AvatarProfile'
import { Statis, UserStats } from '@/components/profile/UserStats'
import { Navbar } from '@/components/profile/Navbar'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Info } from '@/app/profile/page'

export const DesktopProfile = () : JSX.Element => {
    const [user, setUser] = useState<Info | null>()
    useEffect(() => {
      axios
        .get('https://jsonplaceholder.typicode.com/users')
        .then(userData => setUser(userData.data[1]))
        .catch(error => console.log(error))
    }, []);
    
    return (
      <div className='flex flex-col gap-10 mx-[20px]'>
          <div className='bg-[#243230] relative'>
            <ImageUpload />
            <AvatarProfile position="left-[41vw] bottom-[7vh] z-10" />
            <div className='absolute bg-[#161F1E] bg-opacity-90
                   bottom-0 w-full h-[10vh] rounded-md'>
               
                <div className='text-white flex justify-between items-center ml-6'>
  
                  <div className='flex items-center justify-between py-8 w-1/3'>
                    <Statis title="Total game" total={122} line={true} style="text-[1.5em] md:text-[1.1em]"/>
                    <Statis title='Wins' total={75} line={true} style="text-[1.5em] md:text-[1.1em]"/>
                    <Statis title='Loses' total={464} line={false} style="text-[1.5em] md:text-[1.1em]"/>
                  </div>
  
                  <div className='w-1/3 flex justify-center items-center'>
                    <h2 className='text-[2em] md:text-[1.5em] text-white font-bold mt-2'>{user?.username}</h2>
                  </div>
  
                  <div className='flex items-center justify-end gap-4 w-1/3 mr-7'>
                      <div className='flex flex-col items-center'>
                          <h3 className='text-[#E0E0E0] font-normal text-[1.5em] md:text-[1.1em]'>Location</h3>
                          <div className='flex justify-center items-center'>
                            <img
                              className='h-[13px] w-[22px]'
                              alt="Morocco"
                              src="http://purecatamphetamine.github.io/country-flag-icons/3x2/MA.svg"
                            />
                            <h3 className='uppercase text-white text-[1.5m] md:text-[1.1em] font-bold pl-2'>mar</h3>
                        </div>
                      </div>
  
                      <div className='border-r-[1px] h-[51px] left-4 border-[#3D4042]'></div>
  
                      <div className='flex flex-col items-center'>
                          <h3 className='text-[#E0E0E0] font-normal text-[1.5em]'>Rank</h3>
                          <h2 className='font-bold text-[1em]'>15</h2>
                      </div>
                  </div>
  
                </div>
  
              </div>
          </div>
          <Navbar mobile={false} style="rounded-md h-[4.5vh] flex text-[24px] font-semibold" />
      </div>
    );
  };