'use client';
import Image from 'next/image';
import { RiNotification2Fill } from 'react-icons/ri';
import logo from '@/../public/logo2.svg';
import { Logout } from './Logout';
import Settings from './Settings';
import * as Popover from '@radix-ui/react-popover';
import Notification from '@/components/profile/Notification';
import { Socket } from 'socket.io-client';
import React, { useContext } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { socketContext } from '@/app/Dashboard';

const token = Cookies.get('token');

interface Props {
  socket: Socket | null;
  pendingRequests: any;
}

const Header: React.FC<Props> = ({ socket, pendingRequests }): JSX.Element => {
  const [notifications, setnotifications] = React.useState<any[] | null>(null);
  const [shownotification, setshownotification] =
    React.useState<boolean>(false);
  const handleNotificationClik = () => {
    setshownotification(!shownotification);
  };

  if (!token) {
    toast.error('You are not logged in');
    return <div></div>;
  }
  React.useEffect(() => {
    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/friendRequests`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setnotifications(data);
        return;
      }
      toast.error(res.statusText);
    })();
  }, [pendingRequests, shownotification, socket]);

  return (
    <>
      <div className="flex justify-center items-center">
        <Image
          className="flex justify-center lg:w-[150px] xl:w-[150px] md:w-[150px] "
          src={logo}
          height={32}
          width={79}
          alt="Picture of the author"
          priority
        />
      </div>
      <nav className="flex justify-center items-center">
        <ul className="flex items-center  gap-5 justify-center">
          <Settings login={false} />
          <li>
            <Popover.Root>
              <Popover.Trigger asChild aria-controls="radix-:R1mcq:">
                <button onClick={handleNotificationClik}>
                  <RiNotification2Fill size={32} color="#E0E0E0" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="text-white rounded p-2 md:p-3 w-[90vw] sm:w-[60vw] md:w-[55vw] lg:w-[40vw] xl:w-[35vw] 2xl:w-[25vw] bg-[#2B504B]"
                  sideOffset={5}
                >
                  <div className="flex flex-col gap-2.5">
                    <h1 className="tracking-wide ml-2 font-bold sm:text-lg 2xl:text-xl">
                      Notifications
                    </h1>

                    {notifications &&
                      notifications?.map(
                        (friendshipData: any, index: number) => (
                          <Notification
                            friendshipData={friendshipData}
                            key={index}
                            isFriend
                            pendingRequests={pendingRequests}
                          />
                        )
                      )}
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
