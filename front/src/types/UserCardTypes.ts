export interface UserCardProps {
  username: string;
  userId: string;
  avatar: string;
  addRequest?: boolean;
  online?: boolean;
  inGame?: boolean;
  socket:any;
  mode: string;
}
