import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dtos/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(params: { login: string }): Promise<any> {
    const { login } = params;
    // console.log('++findOne++>', login);
    const user = await this.prisma.user.findUnique({
      where: { id: login },
    });
    if (!user) return {};
    return user;
  }
  async findOneLogin(params: { login: string }): Promise<User> {
    const { login } = params;
    console.log('+USER+findOne++>', login);
   try {
    return await this.prisma.user.findUnique({
      where: { login },
    });
   } catch (error) {
      console.log('error', error);
    return null;
   }
  }

  async findAll(kind?: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { kind },
      include: {
        Rooms: true,
        directMessage: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const Req_Data: Prisma.UserCreateInput = data;
    if (Req_Data.is_active === true && Req_Data.login !== 'aboulhaj')
      data.is_active = false;
    return await this.prisma.user.create({
      data,
    });
  }

  async update(params: { id: string; data: UpdateUserDto }): Promise<User> {
    const { id, data } = params;
    // console.log('++update++>', id);

    return await this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async remove(id: string): Promise<User> {
    // console.log('++remove++>', id);

    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserDirectMessages(userId: string) {
    // Add your logic to fetch the direct messages for the user from the database or any other source
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        directMessage: true,
      },
    });
    return user;
  }
}
