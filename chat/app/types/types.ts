export type OLdMessages = {
  name: string;
  LastMessage: string;
  create_At: string;
  image: string;
};

export type Message = {
  content: string;
};

export type membersType = {};
export type messagesType = {
  content: string;
  id: string;
  senderId: string;
  roomsId: string;
  created_at: string;
  updated_at: string;
};
export type RoomsType = {
  id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
  members: membersType[];
  messages: Message[];
};
