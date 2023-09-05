import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
  async findAll() {
    return await this.prisma.directMessage.findMany();
  }
  async findOne(id: string) {
    return await this.prisma.directMessage.findUnique({
      where: {
        id: id,
      },
      include: {
        User: true,
        Messages: true,
      },
    });
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
}
