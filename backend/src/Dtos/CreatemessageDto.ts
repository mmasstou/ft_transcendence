import { Prisma } from '@prisma/client';

export class CreatemessageDto {
  content: string;
  sender: Prisma.UserCreateNestedOneWithoutMessagesInput;
  roomId: Prisma.RoomsCreateNestedOneWithoutMessagesInput;
}
