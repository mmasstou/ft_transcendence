export type OLdMessages = {
  name: string;
  LastMessage: string;
  create_At: string;
  image: string;
};

export type Message = {
  content: string;
};

export type ChanneLnotificationType = {
  id: string;
  content: string;
  channelId: string;
  created_at: string;
  updated_at: string;
};

export type membersType = {
  id: string;
  type: string;
  userId: string;
  isban: boolean;
  ismute: boolean;
  roomsId: string;
  directmessageId: string;
  created_at: string;
  updated_at: string;
  mute_at: string;
};
export type messagesType = {
  viewed: number;
  content: string;
  id: string;
  dm: any;
  dmId: string;
  senderId: string;
  roomsId: string;
  created_at: string;
  updated_at: string;
};

// export type RoomsType = {
//   id: string;
//   name: string;
//   type: string;
//   created_at: string;
//   updated_at: string;
//   members: membersType[];
//   messages: Message[];
// };

export type RoomsType = {
  id: string;
  name: string;
  type: string;
  viewedmessage: number;
  password: string;
  created_at: string;
  updated_at: string;
  hasAccess: boolean;
  members: membersType[];
  messages: Message[];
  accesspassword: string;
  slug: string;
};

export type userType = {
  id: string;
  login: string;
  email: string;
  password: string | null;
  name: string;
  kind: null;
  avatar: string | '';
  bg_color: string[] | null;
  paddle_color: string | null;
  ball_color: string | null;
  intraId: number;
  banner: string | '';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  Rooms: RoomsType[];
  location: string;
  twoFactorAuthenticationSecret: string;
  twoFA: boolean;
  isSecondFactorAuthenticated: boolean;
  status: 'online' | 'offline' | 'inGame';
  TotalWin: number;
  TotalLose: number;
  TotalMatch: number;
  TotalDraw: number;
  Level: number;
};

export type cursusType = {
  id: string;
  grade: string;
  level: Float32Array;
  blackholed_at: string;
};
export type messageSocket = {
  roomId: string;
  messageContent: string;
};

export type updatememberType = {
  updateType: string;
  member: membersType;
};
// enums :

export enum UserTypeEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  OWNER = 'OWNER',
}
export enum RoomTypeEnum {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  PROTECTED = 'PROTECTED',
}
export enum updatememberEnum {
  SETADMIN = 'SETADMIN',
  BANMEMBER = 'BANMEMBER',
  KIKMEMBER = 'KIKMEMBER',
  MUTEMEMBER = 'MUTEMEMBER',
  PLAYGAME = 'PLAYGAME',
  SETOWNER = 'SETOWNER',
  ACCESSPASSWORD = 'ACCESSPASSWORD',
  ADDMEMBER = 'ADDMEMBER',
  LEAVECHANNEL = 'LEAVECHANNEL',
  DELETECHANNEL = 'DELETECHANNEL',
}

export enum UpdateChanneLSendEnum {
  CHANGETYPE = 'CHANGETYPE',
  SETACCESSEPASSWORD = 'SETACCESSEPASSWORD',
  REMOVEACCESSEPASSWORD = 'REMOVEACCESSEPASSWORD',
  EDITACCESSEPASSWORD = 'EDITACCESSEPASSWORD',
  CHANGEPROTACTEDPASSWORD = 'CHANGEPROTACTEDPASSWORD',
}
export type UpdateChanneLSendData = {
  Updatetype: UpdateChanneLSendEnum;
  password?: string;
  newpassword?: string;
  confirmpassword?: string;
  accesspassword?: string;
  roomtype?: RoomTypeEnum;
  room: RoomsType;
};

export enum USERSETTINGSTEPS {
  INDEX = 0,
  PLAYGAME = 1,
  MEMBERJOIN = 2,
  FINDMEMBER = 3,
}
