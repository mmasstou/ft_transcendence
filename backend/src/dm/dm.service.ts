import { Injectable } from '@nestjs/common';
import { DirectMessage, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class DmService {
  constructor(
    private prisma: PrismaService,
    private messageservice: MessagesService,
    private readonly userService: UserService,
  ) {}
  async findAll(login: string) {
    const user = await this.userService.findOneLogin({ login });
    // find all dms that the user is in :
    return await this.prisma.directMessage.findMany({
      where: {
        User: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        User: true,
        Messages: true,
      },
    });
    // return await this.prisma.directMessage.findMany();
  }
  async findOne(id: string) {
    try {
      const dm = await this.prisma.directMessage.findUnique({
        where: {
          id: id,
        },
        include: {
          User: true,
          Messages: true,
        },
      });
      if (!dm) return null;
      return dm;
    } catch (error) {
      console.log('DmService -> findOne -> error', error.message);
      return null;
    }
  }
  async create(User: User, User1: User) {
    // create dm and link it to the user
    const dm = await this.prisma.directMessage.create({
      data: {
        User: {
          connect: [{ id: User.id }, { id: User1.id }],
        },
      },
    });
    return dm;
  }

  async connectToALLDm(User: User, socket: Socket): Promise<boolean> {
    try {
      const Userdata: any = await this.prisma.user.findUnique({
        where: {
          id: User.id,
        },
        include: {
          dms: true,
        },
      });
      if (!Userdata) throw new Error('Dm not found');
      Userdata.dms.forEach((dm: DirectMessage) => {
        socket.join(dm.id);
      });
      return true;
    } catch (error) {
      console.log('DmService -> connectToALLDm -> error', error.message);
      return false;
    }
  }

  // find dm between senderid and receiverid
  async findDmBetweenTwoUsers(
    senderId: string,
    receiverId: string,
  ): Promise<DirectMessage | null> {
    try {
      const dm = await this.prisma.directMessage.findFirst({
        where: {
          AND: [
            {
              User: {
                some: {
                  id: senderId,
                },
              },
            },
            {
              User: {
                some: {
                  id: receiverId,
                },
              },
            },
          ],
        },
      });
      if (!dm) return null;
      return dm;
    } catch (error) {
      console.log('DmService -> findDmBetweenTwoUsers -> error', error.message);
      return null;
    }
  }

  async delete(id: string) {
    try {
      const dm = await this.prisma.directMessage.delete({
        where: {
          id: id,
        },
      });
      return dm;
    } catch (error) {
      console.log('DmService -> delete -> error', error.message);
      return null;
    }
  }
}
