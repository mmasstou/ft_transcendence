import React, { FC, use, useState, useEffect } from 'react';
import { TiUserAdd } from 'react-icons/ti';
import { BiJoystick } from 'react-icons/bi';
import { UserCardProps } from '@/types/UserCardTypes';
import Image from 'next/image';
import Cookies from 'js-cookie';
import MyToast from '../ui/Toast/MyToast';
import toast from 'react-hot-toast';

const SenderId = Cookies.get('_id');
const UserCard: FC<UserCardProps> = ({
  username,
  userId,
  status,
  avatar,
  socket,
  mode,
  addRequest,
}) => {
  const [invited, setInvited] = useState(false);
  const [Status, setStatus] = useState(status);
  let timeout: NodeJS.Timeout;
  const handleInvite = () => {
    socket.emit('sendGameNotification', {
      userId: userId,
      senderId: SenderId,
      mode: mode,
    });
    setInvited(true);
    timeout = setTimeout(() => {
      setInvited(false);
    }, 8000);
  };

  useEffect(() => {
    socket && socket.on('GameResponseToChatToUser', (data: any) => {
      if (data.User.id === userId) {
        setInvited(false);
        clearTimeout(timeout);
      }
    });
    socket && socket.on('UserSendToStatus', (data: any) => {
      if (data.id === userId) {
        setInvited(false);
        clearTimeout(timeout);
        setStatus(data.status)
        if (data.status === 'inGame')
          toast.error(data.login + ' is in Game');
        else if (data.status === 'offline')
          toast.error(data.login + ' is offline');
      }
    })
    return () => {
      socket && socket.off('GameResponseToChatToUser');
      socket && socket.off('UserSendToStatus');
    }
  },[])


  return (
    <div className=" bg-container rounded-xl my-3 p-2 xl:p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={avatar}
          height={50}
          width={50}
          priority
          alt={username}
          className="rounded-full border border-secondary"
        />
        <h3 className="xl:text-lg">{username}</h3>
      </div>
      <div className="flex items-center text-xs xl:text-sm gap-2">
        {addRequest ? (
          <button className="flex items-center border p-1 px-2 xl:px-3 rounded-xl border-sky-500 text-sky-500 hover:bg-sky-600 hover:text-container hover:border-container group transition-colors">
            <TiUserAdd
              className="mr-1 fill-sky-500 group-hover:fill-container"
              size={16}
            />
            Add Friend
          </button>
        ) : (
          Status === 'online' && (
            <button
              disabled={invited}
              onClick={handleInvite}
              className={`flex items-center border p-1 px-2 xl:px-3 rounded-xl border-sky-500 text-sky-500 enabled:hover:bg-sky-600 enabled:hover:text-container enabled:hover:border-container group transition-colors
              ${invited && 'opacity-50 cursor-not-allowed '}
              `}
            >
              {addRequest ? (
                <TiUserAdd
                  className="mr-1 fill-sky-500 group-hover:fill-container"
                  size={16}
                />
              ) : (
                Status === 'online' && (
                  <BiJoystick
                    className="mr-1 fill-sky-500 group-enabled:group-hover:fill-container"
                    size={16}
                  />
                )
              )}
              Invite
            </button>
          )
        )}
        {!addRequest && (
          <div
            className={`border flex gap-1 items-center p-1 px-2 xl:px-3 rounded-xl ${
              Status === 'inGame'
                ? 'border-orange-500'
                : Status === 'online'
                ? 'border-green-500'
                : 'border-yellow-500'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                Status === 'inGame'
                  ? 'bg-orange-500'
                  : Status === 'online'
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`}
            ></div>
            <span
              className={`
            ${
              Status === 'inGame'
                ? 'text-orange-500'
                : Status === 'online'
                ? 'text-green-500'
                : 'text-yellow-500'
            }
          `}
            >
              {Status === 'inGame'
                ? 'In Game'
                : Status === 'online'
                ? 'Online'
                : 'Offline'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
