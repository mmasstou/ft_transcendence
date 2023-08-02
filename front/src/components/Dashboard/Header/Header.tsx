'use client';
import Image from 'next/image';
import { RiNotification2Fill, RiSettingsLine } from 'react-icons/ri';
import logo from '@/../public/logo2.svg';
import { Logout } from './Logout';
import Settings from './Settings';
import * as Popover from '@radix-ui/react-popover';
import Notification from '@/components/profile/Notification';
import { Socket } from 'socket.io-client';
import React from 'react';
import { membersType, userType } from '@/types/types';


const Header = ({ socket }: { socket: Socket | null }): JSX.Element => {
  const [Notifications, setNotifications] = React.useState<any[]>([])
  socket?.on('notificationEvent', (data) => {
    console.log("notificationEvent data :", data)
    setNotifications([...Notifications, data])
  })
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
        <ul className="flex items-center  gap-5 justify-center">
          <Settings />
          <li>
            <Popover.Root>
              <Popover.Trigger asChild>
                <button>
                  <RiNotification2Fill size={32} color="#E0E0E0" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="text-white rounded p-2 md:p-3 w-[90vw] sm:w-[60vw] md:w-[55vw] lg:w-[40vw] xl:w-[35vw] 2xl:w-[25vw] bg-[#2B504B]"
                  sideOffset={5}
                >
                  <div className="flex flex-col gap-2.5">
                    <h1 className='tracking-wide ml-2 font-bold sm:text-lg 2xl:text-xl'>Notifications</h1>
                    {
                      Notifications.map((notification: {
                        message: string, User: userType,
                        member: membersType,
                        sendedUser: userType
                      }, index) => {
                        return (
                          <Notification key={index} avatar={notification.sendedUser.avatar} name={notification.sendedUser.login} message={notification.message} />
                        )
                      }
                      )
                    }
                    {/* <Notification avatar='/avatar.jpg' name='mehdi' message='send a friend request.' isFriend isOnline />
          <Notification avatar='/avatar.jpg' name='mehdi' message='send a friend request.' isFriend />
          <Notification avatar='/avatar.jpg' name='mehdi' message='send a friend request.'/> */}
                  </div>
                  <Popover.Arrow className="fill-[#2B504B]" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </li>
          <Logout />
        </ul>
      </nav>
    </>
  );
};

export default Header;
