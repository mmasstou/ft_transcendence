import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dtos/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(params: { login: string }): Promise<User> {
    const { login } = params;
    console.log('++findOne++>', login);
    return await this.prisma.user.findUnique({
      where: { id :login },
    });
  }
  async findOneID(params: { login: string }): Promise<User> {
    const { login } = params;
    console.log('++findOne++>', login);
    return await this.prisma.user.findUnique({
      where: {login },
    });
  }

  async findAll(kind?: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { kind },
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
    console.log('++update++>', id);

    return await this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async remove(id: string): Promise<User> {
    console.log('++remove++>', id);

    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
