export type UserCardProps =  {
  login: string;
  userId: string;
  avatar: string;
  status : 'online' | 'offline' | 'inGame';
  socket:any;
  mode: string;
} & (
  | {
      addRequest?: true;
      addFriendFunc: (userId: string) => void;
    }
  | {
      addRequest?: false;
      status: 'online' | 'offline' | 'inGame';
    }
);
