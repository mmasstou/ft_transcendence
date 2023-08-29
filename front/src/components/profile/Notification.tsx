import Cookies from 'js-cookie';
import Image from 'next/image';
import React, { FC } from 'react';
import toast from 'react-hot-toast';

type NotificationProps = {
  message: string;
  friendshipData: any;
  directMessage?: boolean;
} & (
  | {
      isFriend?: true;
      isOnline?: boolean;
    }
  | {
      isFriend?: false;
      isOnline: never;
    }
);

const token = Cookies.get('token');
const Notification: FC<NotificationProps> = ({
  isFriend,
  isOnline,
  message,
  friendshipData,
  directMessage,
}) => {
  const [friend, setfriend] = React.useState<any | null>(null);
  if (!token) {
    toast.error('You are not logged in');
    return <div></div>;
  }

  React.useEffect(() => {
    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${friendshipData.userId}`,
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
        setfriend(data);
        console.log('friend data: ', data);
        return;
      }
    })();
  }, []);
  return (
    <div className="bg-primary rounded-md p-2">
      <div className="flex flex-col gap-1 lg:gap-2">
        <div className="flex items-center">
          <div
            className={`h-10 w-10 2xl:h-12 2xl:w-12 rounded-full border ${
              isOnline ? 'border-green-500' : 'border-gray-500'
            } relative p-4 mx-2 2xl:mx-4`}
          >
            {isFriend && (
              <div
                className={`w-3 h-3 rounded-full ${
                  friend?.status ? 'bg-green-500' : 'bg-gray-500'
                } absolute right-0 2xl:right-1 bottom-0 z-10`}
              ></div>
            )}
            <Image
              src={friend?.avatar}
              alt=""
              className="rounded-full"
              fill
              priority
            />
          </div>
          <h3 className="text-xs lg:text-sm tracking-wider">
            <strong className="text-secondary text-sm lg:text-base capitalize">
              {friend && friend.login}
            </strong>{' '}
            {isFriend && directMessage === true ? `: ${message}` : message}
          </h3>
        </div>
        <div className="flex gap-2 xl:gap-3 self-end text-xs md:text-sm ">
          <button
            className="bg-secondary py-1 px-2 border border-secondary rounded-md text-black 
          hover:bg-transparent hover:text-secondary transition-all duration-150"
          >
            {directMessage ? 'Reply' : 'Accept'}
          </button>
          <button
            className="bg-red-500 py-1 px-2 border border-red-500 rounded-md text-white 
          hover:bg-transparent hover:text-red-500 transition-all duration-150"
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
