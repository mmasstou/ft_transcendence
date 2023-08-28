'use client';
import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import style from '@/components/Home/style';
import Cookies from 'js-cookie';
import { userType } from '@/types/types';
import getUserWithId from '@/app/chat/channels/actions/getUserWithId';
import { toast } from 'react-hot-toast';

const MyAvatar = ({ User }: { User?: userType | null }) => {
  const [LogedUser, setLogedUser] = React.useState<userType | null | undefined>(User);

  React.useEffect(() => {
   (async () => {
      toast('loading user data ...')
      const token = Cookies.get('token');
      const userId = Cookies.get('_id');
      if (!token || !userId) return;
      const res = await getUserWithId(userId, token);
      if (res) setLogedUser(res);
    })();
  }, []);

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
