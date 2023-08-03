import { RoomTypeEnum, RoomsType } from 'src/users/user.type';

export enum UpdateChanneLSendEnum {
  CHANGETYPE = 'CHANGETYPE',
  SETACCESSEPASSWORD = 'SETACCESSEPASSWORD',
  REMOVEACCESSEPASSWORD = 'REMOVEACCESSEPASSWORD',
  EDITACCESSEPASSWORD = 'EDITACCESSEPASSWORD',
}
export type UpdateChanneLSendData = {
  Updatetype: UpdateChanneLSendEnum;
  password?: string;
  confirmpassword?: string;
  accesspassword?: string;
  roomtype?: RoomTypeEnum;
  room: RoomsType;
};
