import { BsSend } from 'react-icons/bs';
import { BiUserPlus, BiUserX } from 'react-icons/bi';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { socketContext } from '@/app/Dashboard';
import { MdPendingActions } from 'react-icons/md';
import { userType } from '@/types/types';

interface ButtonProps {
  text: string;
  user?: userType | null;
  isFriend?: boolean;
  updateFriendState: (newState: boolean) => void;
  updatePendingState: (newState: boolean) => void;
  isPending?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  user,
  isFriend,
  updateFriendState,
  updatePendingState,
  isPending,
}) => {
  const contextValue = useContext(socketContext);

  const token = Cookies.get('token');

  const sendFriendRequest = async () => {
    const PostData = {
      receiverId: user?.id,
    };
    if (PostData) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/friend-requests/send`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(PostData),
          }
        );
        if (response.ok) {
          updatePendingState(true);
        }
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  const removeFrined = async () => {
    const PostData = {
      friendId: user?.id,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/removefriend`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(PostData),
        }
      );
      if (response.ok) {
        updateFriendState(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFriendRequest = async () => {
    if (!isFriend) {
      sendFriendRequest();
    } else {
      removeFrined();
    }
  };

  useEffect(() => {
    if (contextValue?.message === 'Your friend request has been accepted.') {
      updateFriendState(true);
      updatePendingState(false);
    } else if (
      contextValue?.message === 'Your friend request has been rejected.'
    ) {
      updateFriendState(false);
      updatePendingState(false);
    }
  }, [contextValue]);

  return (
    <>
      {text === 'Message' ? (
        <button
          onClick={() => {}}
          className="flex justify-evenly items-center border-2 border-[#D9D9D9] rounded-full
       p-2 text-[#D9D9D9] hover:opacity-70 w-[10rem]"
        >
          <BsSend />
          <span>{text}</span>
        </button>
      ) : (
        <button
          onClick={handleFriendRequest}
          disabled={isPending}
          className={`flex justify-evenly items-center border-2 border-[#D9D9D9] rounded-full
       p-2 text-[#D9D9D9] hover:opacity-70 w-[10rem] ${
         isPending ? 'cursor-not-allowed' : ''
       } ${isFriend ? 'text-red-500 border-red-500' : ''}`}
        >
          {isPending ? (
            <>
              <MdPendingActions />
              <span>Pending Request</span>
            </>
          ) : isFriend ? (
            <>
              <BiUserX />
              <span>Unfriend</span>
            </>
          ) : (
            <>
              <BiUserPlus />
              <span>Add Friend</span>
            </>
          )}
        </button>
      )}
    </>
  );
};

export default Button;
