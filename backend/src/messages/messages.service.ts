import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Messages } from '@prisma/client';
import { UpdateMessageDto } from 'src/Dtos/UpdateMessageDto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async findOne(params: { id: string }): Promise<Messages> {
    try {
      const { id } = params;
      // console.log('++findOne||++>', id);
      const message = await this.prisma.messages.findUnique({
        where: { id },
      });
      if (!message) throw new Error('');
      return message;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findALLForChanneL(channeLId: string): Promise<Messages[]> {
    return this.prisma.messages.findMany({
      where: {
        roomsId: channeLId,
      },
      orderBy: {
        created_at: 'asc', // or 'desc' for descending order
      },
    });
  }

  async create(data: {
    content: string;
    userId: string;
    roomId?: string;
    DirectMessage?: string;
  }): Promise<Messages> {
    // const user =
    try {
      if (data.DirectMessage) {
        return await this.prisma.messages.create({
          data: {
            content: data.content,
            sender: {
              connect: { id: data.userId },
            },
          },
        });
      }
      return await this.prisma.messages.create({
        data: {
          content: data.content,
          sender: {
            connect: { id: data.userId },
          },
          roomId: {
            connect: { id: data.roomId },
          },
        },
        include: {
          sender: true,
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
    data: UpdateMessageDto;
  }): Promise<Messages> {
    const { id, data } = params;
    // console.log('++update++>', id);

    return await this.prisma.messages.update({
      data,
      where: { id },
    });
  }

  async remove(id: string): Promise<Messages> {
    // console.log('++remove++>', id);

    return await this.prisma.messages.delete({
      where: { id },
    });
  }

  async removeALL(id: string) {
    // console.log('++removeALL++>', id);
    return await this.prisma.messages.deleteMany({
      where: { roomsId: id },
    });
  }
}
