export enum JoinStatusEnum {
  JOINED = 'JOINED',
  NOTJOINED = 'NOTJOINED',
}

export type JoinStatusType = {
  joinStatus: JoinStatusEnum;
  channeLId: string;
  userId: string;
  login: string;
  joinmessage: string;
};
