import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Members, Prisma, UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async findOne(params: {
    userId: string;
    roomId: string;
  }): Promise<Members | null> {
    try {
      const { userId, roomId } = params;
      // console.log('++findOne||++>', id);
      const response = await this.prisma.members.findFirst({
        where: {
          userId,
          roomsId: roomId,
        },
      });
      if (!response) new NotFoundException();
      return response;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Members[]> {
    return this.prisma.members.findMany();
  }

  async findALLForRoom(roomId: string): Promise<Members[]> {
    // console.log('++findALLForRoom++>', roomId);

    return this.prisma.members.findMany({
      where: {
        RoomId: { id: roomId },
      },
      orderBy: {
        created_at: 'asc', // or 'desc' for descending order
      },
    });
  }

  async create(data: {
    type: any | Prisma.EnumUserTypeFieldUpdateOperationsInput;
    user: string;
    roomId?: string;
    directMessageId?: string;
  }): Promise<Members> {
    // const user =
    try {
      const { type, user, roomId } = data;
      return await this.prisma.members.create({
        data: {
          type: type,
          user: {
            connect: { id: user },
          },
          RoomId: {
            connect: { id: roomId },
          },
        },
      });
    } catch (error) {
      return null;
    }
  }

  async update(params: {
    id: string;
    type?: UserType | Prisma.EnumUserTypeFieldUpdateOperationsInput;
    isban?: boolean;
    ismute?: boolean;
  }): Promise<Members | null> {
    try {
      const { id, type, isban, ismute } = params;
      // console.log('++update++>', id);

      const oLdMember = await this.prisma.members.findUnique({
        where: { id },
      });
      if (!oLdMember) throw new NotFoundException();
      const __isBan = isban ? isban : oLdMember.isban;
      const __isMute = ismute ? ismute : oLdMember.ismute;
      const __type = type ? type : oLdMember.type;
      return await this.prisma.members.update({
        data: { type: __type, isban: __isBan, ismute: __isMute },
        where: { id },
      });
    } catch (error) {
      return null;
    }
  }

  async remove(id: string): Promise<Members> {
    // console.log('++remove++>', id);

    return await this.prisma.members.delete({
      where: { id },
    });
  }
}
