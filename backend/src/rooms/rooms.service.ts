import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Messages, Rooms } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateRoomDto } from './dtos/UpdateRoomDto';
import { MembersService } from 'src/members/members.service';
import { MessagesService } from 'src/messages/messages.service';

enum RoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
@Injectable()
export class RoomsService {
  constructor(
    private prisma: PrismaService,
    private membersservice: MembersService,
    private messageservice: MessagesService,
  ) {}

  async findOne(params: { name: string }): Promise<Rooms> {
    try {
      const { name } = params;
      // console.log('++findOne++>', name);
      const room = await this.prisma.rooms.findUnique({
        where: { name },
      });
      if (!room) throw new Error('');
      return room;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findAll(): Promise<Rooms[]> {
    return this.prisma.rooms.findMany({
      include: {
        members: true,
        messages: true,
      },
    });
  }

  async create(data: {
    name: string;
    userId: string;
    type: string;
  }): Promise<Rooms> {
    try {
      const _type: any =
        data.type === RoomType.PRIVATE ? RoomType.PRIVATE : RoomType.PUBLIC;
      const room: Rooms = await this.prisma.rooms.create({
        data: { name: data.name, type: _type },
      });
      const mumber: any = await this.membersservice.create({
        type: 'ADMIN',
        user: data.userId,
        roomId: room.id,
      });

      const _message = await this.messageservice.create({
        content: `welcome to private channel ! admin : ${mumber.user}`,
        userId: data.userId,
        roomId: room.id,
      });
      console.log('Ana Hana :', mumber);

      return await this.prisma.rooms.update({
        where: {
          id: room.id,
        },
        data: {
          members: {
            connect: { id: mumber.id },
          },
          messages: {
            connect: { id: _message.id },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "CAN'T CREATE ROOM",
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async update(params: { id: string; data: UpdateRoomDto }): Promise<Rooms> {
    const { id, data } = params;
    // console.log('++update++>', id);

    return await this.prisma.rooms.update({
      data,
      where: { id },
    });
  }

  async remove(id: string): Promise<Rooms> {
    console.log('++remove++>', id);

    try {
      const room = await this.prisma.rooms.findUnique({
        where: { id },
        include: { members: true },
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      // Delete all associated Members entities first
      const mmrs = await this.prisma.members.deleteMany({
        where: { roomsId: id },
      });
      console.log('mmrs :', mmrs);

      // Delete all associated Members entities first
      const rms = await this.prisma.messages.deleteMany({
        where: { roomsId: id },
      });
      console.log('rms :', rms);

      return await this.prisma.rooms.delete({
        where: { id },
      });
    } catch (error) {
      console.log('+++> error :', error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `CAN'T ROMOVE ROOM ${id}`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async AddMessage(dep: {
    roomId: string;
    content: string;
    userId: string;
  }): Promise<Rooms> {
    try {
      const User = await this.prisma.user.findUnique({
        where: { id: dep.userId },
      });
      const roomIId = await this.prisma.rooms.findUnique({
        where: { id: dep.roomId },
      });
      // console.log('User :', User);
      // console.log('roomIId :', roomIId);

      const message = await this.prisma.messages.create({
        data: {
          content: dep.content,
          sender: {
            connect: { id: User.id },
          },
          roomId: {
            connect: { id: roomIId.id },
          },
        },
      });

      // console.log('message :', message);
      const room = this.prisma.rooms.update({
        where: { id: dep.roomId },
        data: {
          messages: {
            connect: { id: message.id },
          },
          members: {
            connect: { id: User.id },
          },
        },
        include: {
          messages: true,
        },
      });
      return room;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: "CAN'T CREATE THIS MESSAGE",
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
  }

  async JoinUser(params: { userId: string; roomId: string }) {
    try {
      // const User = await this.prisma.user.findUnique({
      //   where: { id: params.userId },
      // });
      const Member = await this.prisma.members.create({
        data: {
          user: {
            connect: { id: params.userId },
          },
          RoomId: {
            connect: { id: params.roomId },
          },
          type: 'USER',
        },
      });
      return await this.prisma.rooms.update({
        data: {
          members: {
            connect: { id: Member.id },
          },
        },
        where: {
          id: params.roomId,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "CAN'T EDIT THIS MESSAGE",
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
  async UpdateMessage(params: {
    messageId: string;
    content: string;
  }): Promise<Messages> {
    try {
      const message = await this.prisma.messages.update({
        where: {
          id: params.messageId,
        },
        data: { content: params.content },
      });
      return message;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "CAN'T EDIT THIS MESSAGE",
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async DeleteMessage(params: { messageId: string }): Promise<Messages> {
    try {
      const message = await this.prisma.messages.delete({
        where: { id: params.messageId },
      });
      return message;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'NO MESSAGE WIDTH THIS ID',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
  async getaLLmessages(messageId: string) {
    try {
      const message = await this.prisma.rooms.findUnique({
        where: { id: messageId },
        select: {
          messages: true,
        },
      });
      return message;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'NO MESSAGE WIDTH THIS ID',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
}
