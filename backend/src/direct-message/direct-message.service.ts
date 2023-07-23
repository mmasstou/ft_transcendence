import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DirectMessage, UserType } from '@prisma/client';
import { MembersService } from 'src/members/members.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DirectMessageService {
  constructor(
    private prisma: PrismaService,
    private membersservice: MembersService,
  ) {}
  createMember(userId: string, roomId: string, receiverId: string) {
    const result = this.prisma.$transaction(async (prisma) => {
      const User = await prisma.user.findUnique({ where: { id: userId } });
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
      });
    });
  }

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

  async findAll(): Promise<DirectMessage[]> {
    return this.prisma.directMessage.findMany({
      include: {
        messages: true,
      },
    });
  }

  async create(data: { receiverId: string; userId: string }) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const receiver = await prisma.user.findUnique({
          where: { id: data.receiverId },
        });
        console.log('receiver', receiver.id);
        const user = await prisma.user.findUnique({
          where: { id: data.userId },
        });

        console.log('user', user.id);
        const directMessage = await prisma.directMessage.create({
          data: {
            name: receiver.login,
          },
        });

        console.log('directMessage', directMessage.id);

        const sender_member = await this.prisma.members.create({
          data: {
            user: { connect: { id: user.id } },
            type: UserType.SENDER,
          },
        });

        console.log('sender_member', sender_member.id);
        const receiver_member = await this.prisma.members.create({
          data: {
            user: { connect: { id: receiver.id } },
            type: UserType.RECEIVER,
          },
        });
        console.log('receiver_member', receiver_member.id);
        return await prisma.directMessage.update({
          where: { id: directMessage.id },
          data: {
            members: {
              connect: [{ id: sender_member.id }, { id: receiver_member.id }],
            },
          },
          include: { members: true },
        });
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
