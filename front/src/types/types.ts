export type OLdMessages = {
  name: string;
  LastMessage: string;
  create_At: string;
  image: string;
};

export type Message = {
  content: string;
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

};
export type messagesType = {
  viewed: number;
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


export type userType ={
    id: string,
    login: string,
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    kind: string,
    image: string,
    is_active: boolean,
    created_at: string,
    updated_at: string
}

export type messageSocket = {
  roomId: string,
  messageContent: string,
}

export type updatememberType = {
  updateType: string,
  member: membersType,
}