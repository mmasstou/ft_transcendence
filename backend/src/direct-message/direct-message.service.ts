import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DirectMessageService {
  constructor(private prisma: PrismaService) {}

  async findOne(params: { id: string }) {
    try {
      const { id } = params;
      // console.log('++findOne++>', name);
      const room = await this.prisma.directMessage.findUnique({
        where: { id },
      });
      if (!room) throw new Error('');
      return room;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async create(data: { receiverId: string; userId: string }) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const receiver = await prisma.user.findUnique({
          where: { id: data.receiverId },
        });

        const user = await prisma.user.findUnique({
          where: { id: data.userId },
        });

        const directMessage = await prisma.directMessage.create({
          data: {
            name: receiver.login,
            receiver: {
              connect: {
                id: receiver.id,
              },
            },
          },
        });

        if (user) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              DirectMessage: {
                connect: {
                  id: directMessage.id,
                },
              },
            },
          });
        } else {
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: "can't find user",
            },
            HttpStatus.FORBIDDEN,
          );
        }

        return directMessage;
      });
      return result;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getMessaages(params: { id: string }) {
    try {
      const { id } = params;
      // console.log('++findOne++>', name);
      const room = await this.prisma.directMessage.findUnique({
        where: { id },
        select: {
          messages: true,
        },
      });
      if (!room) throw new Error('');
      return room;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
