export type UserCardProps =  {
  username: string;
  userId: string;
  avatar: string;
  status : 'online' | 'offline' | 'inGame';
  socket:any;
  mode: string;
} & (
  | {
      addRequest?: true;
      status: never;
    }
  | {
      addRequest?: false;
      status: 'online' | 'offline' | 'inGame';
    }
);
