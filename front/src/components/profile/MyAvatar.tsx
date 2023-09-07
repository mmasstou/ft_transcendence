'use client';
import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import style from '@/components/Home/style';
import Cookies from 'js-cookie';
import { userType } from '@/types/types';
import getUserWithId from '@/app/chat/channels/actions/getUserWithId';
import { UpdateDataProvider } from '@/app/Dashboard';

const MyAvatar = ({ User }: { User?: userType | null }) => {
  const { updated, setUpdated } = UpdateDataProvider();
  const [LogedUser, setLogedUser] = React.useState<userType | null | undefined>(
    User
  );

  React.useEffect(() => {
    (async () => {
      const token = Cookies.get('token');
      const userId = Cookies.get('_id');
      if (!token || !userId) return;
      const res = await getUserWithId(userId, token);
      if (res) setLogedUser(res);
    })();
  }, [updated]);

  return (
    <Avatar.Root
      className={`${style.flexCenter} flex-inline align-middle overflow-hidden select-none
            rounded-full w-full h-full`}
    >
      <Avatar.Image
        className="w-full h-full object-cover border-secondary rounded-full"
        src={LogedUser?.avatar}
        sizes="100%"
        alt="User Avatar"
      />
    </Avatar.Root>
  );
};

export default MyAvatar;
