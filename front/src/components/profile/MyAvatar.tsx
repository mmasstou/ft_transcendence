'use client';
import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import style from '@/components/Home/style';
import Cookies from 'js-cookie';
import { userType } from '@/types/types';
import getUserWithId from '@/app/chat/channels/actions/getUserWithId';

const MyAvatar = () => {
  const [LogedUser, setLogedUser] = React.useState<userType | null>(null);

  React.useEffect(() => {
    (async () => {
      const token = Cookies.get('token');
      const userId = Cookies.get('_id');
      if (!token || !userId) return;
      const res = await getUserWithId(userId, token);
      // console.log('const MyAvatar = () :', res);
      if (res) setLogedUser(res);
    })();
  }, []);

  return (
    <Avatar.Root
      className={`${style.flexCenter} flex-inline align-middle overflow-hidden select-none
            rounded-full `}
    >
      <Avatar.Image
        className="w-[100%] h-[100%] object-cover rounded-[inherit] border-secondary"
        src={LogedUser?.avatar}
        alt="User Avatar"
      />
    </Avatar.Root>
  );
};

export default MyAvatar;
