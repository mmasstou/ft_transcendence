import { RoomTypeEnum, RoomsType } from 'src/users/user.type';

export enum UpdateChanneLSendEnum {
  CHANGETYPE = 'CHANGETYPE',
  SETACCESSEPASSWORD = 'SETACCESSEPASSWORD',
  REMOVEACCESSEPASSWORD = 'REMOVEACCESSEPASSWORD',
  EDITACCESSEPASSWORD = 'EDITACCESSEPASSWORD',
}
export type UpdateChanneLSendData = {
  Updatetype: UpdateChanneLSendEnum;
  accesspassword?: string;
  roomtype?: RoomTypeEnum;
  room: RoomsType;
};
