import React, { FC } from 'react';
import { TiUserAdd } from 'react-icons/ti';
import { BiJoystick } from 'react-icons/bi';
import { UserCardProps } from '@/types/UserCardTypes';

const UserCard: FC<UserCardProps> = ({
  username,
  addRequest,
  online,
  inGame,
  invite,
}) => {
  return (
    <div className=" bg-container rounded-xl my-2 p-2 lg:p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 xl:w-14 xl:h-14 bg-black rounded-full"></div>
        <h3 className="xl:text-lg">{username}</h3>
      </div>
      <div className="flex items-center text-xs xl:text-sm gap-2">
        <button className="flex items-center border p-1 px-2 xl:px-3 rounded-xl border-sky-500 text-sky-500 hover:bg-sky-600 hover:text-container hover:border-container group transition-colors">
          {addRequest ? (
            <TiUserAdd
              className="mr-1 fill-sky-500 group-hover:fill-container"
              size={16}
            />
          ) : (
            invite && (
              <BiJoystick
                className="mr-1 fill-sky-500 group-hover:fill-container"
                size={16}
              />
            )
          )}
          {addRequest ? 'Add Friend' : invite && 'Invite'}
        </button>
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
      </div>
    </div>
  );
};

export default UserCard;
