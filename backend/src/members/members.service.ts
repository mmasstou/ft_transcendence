import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Members, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async findOne(params: { id: string }): Promise<Members> {
    try {
      const { id } = params;
      // console.log('++findOne||++>', id);
      const message = await this.prisma.members.findUnique({
        where: { id },
      });
      if (!message) throw new Error('');
      return message;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findAll(): Promise<Members[]> {
    return this.prisma.members.findMany();
  }

  async create(data: {
    type: any | Prisma.EnumUserTypeFieldUpdateOperationsInput;
    user: string;
    roomId: string;
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
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "CAN'T CREATE THIS MESSAGE",
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async update(params: {
    id: string;
    type: Prisma.EnumUserTypeFieldUpdateOperationsInput;
  }): Promise<Members> {
    const { id, type } = params;
    // console.log('++update++>', id);

    return await this.prisma.members.update({
      data: { type },
      where: { id },
    });
  }

  async remove(id: string): Promise<Members> {
    // console.log('++remove++>', id);

    return await this.prisma.members.delete({
      where: { id },
    });
  }
}
