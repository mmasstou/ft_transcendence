import React, { FC } from 'react';
import { TiUserAdd } from 'react-icons/ti';
import { BiJoystick } from 'react-icons/bi';
import { UserCardProps } from '@/types/UserCardTypes';
import Image from 'next/image';
import Cookies  from 'js-cookie';

const SenderId = Cookies.get('_id');
const UserCard: FC<UserCardProps> = ({
  username,
  userId,
  addRequest,
  online,
  inGame,
  avatar,
  socket,
  mode,
}) => {
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
          online && (
            <button 
            onClick={() => { socket.emit('sendGameNotification', {userId: userId, senderId: SenderId, mode: mode}) }}
            className="flex items-center border p-1 px-2 xl:px-3 rounded-xl border-sky-500 text-sky-500 hover:bg-sky-600 hover:text-container hover:border-container group transition-colors">
              {addRequest ? (
                <TiUserAdd
                  className="mr-1 fill-sky-500 group-hover:fill-container"
                  size={16}
                />
              ) : (
                online && (
                  <BiJoystick
                    className="mr-1 fill-sky-500 group-hover:fill-container"
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
              inGame
                ? 'border-orange-500'
                : online
                ? 'border-green-500'
                : 'border-yellow-500'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                inGame
                  ? 'bg-orange-500'
                  : online
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`}
            ></div>
            <span
              className={`
            ${
              inGame
                ? 'text-orange-500'
                : online
                ? 'text-green-500'
                : 'text-yellow-500'
            }
          `}
            >
              {inGame ? 'In Game' : online && !inGame ? 'Online' : 'Offline'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
