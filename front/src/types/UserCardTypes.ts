export type UserCardProps =  {
  login: string;
  userId: string;
  avatar: string;
  status? : 'online' | 'offline' | 'inGame';
  socket?:any;
  mode?: string;
  pending?: boolean;
  addFriendFunc?: (userId: string) => void;
} & (
  | {
    addRequest?: true;
    }
  | {
      addRequest?: false;
      status: 'online' | 'offline' | 'inGame';
    }
);
