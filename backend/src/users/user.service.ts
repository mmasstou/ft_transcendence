import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dtos/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async setTwoFactorAuthenticationSecret(secret: string, userLogin: string) {
    return this.prisma.user.update({
      where: {
        login: userLogin,
      },
      data: {
        twoFactorAuthenticationSecret: secret,
      },
    });
  }

  async turnOnTwoFactorAuthentication(userLogin: string) {
    return this.prisma.user.update({
      where: { login: userLogin },
      data: {
        twoFA: true,
      },
    });
  }

  async turnOffTwoFactorAuthentication(userLogin: string) {
    return this.prisma.user.update({
      where: { login: userLogin },
      data: {
        twoFA: false,
      },
    });
  }

  async setBanner(NewBanner: string, userLogin: string) {
    return this.prisma.user.update({
      where: { login: userLogin },
      data: {
        banner: NewBanner,
      },
    });
  }

  async setAvatar(NewAvatar: string, id: string) {
    return this.prisma.user.update({
      where: { id: id },
      data: {
        avatar: NewAvatar,
      },
    });
  }

  async findOne(params: { id: string }): Promise<any> {
    const { id } = params;
    // console.log('++findOne++>', login);
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        conversations: true,
      },
    });
    if (!user) return null;
    return user;
  }
  async findOneLogin(params: { login: string }): Promise<User> {
    const { login } = params;
    // console.log('+USER+findOne++>', login);
    return await this.prisma.user.findUnique({
      where: { login },
    });
  }

  async findAll(kind?: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { kind },
      include: {
        Rooms: true,
        cursus_users: true,
        conversations: true,
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

    return await this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async remove(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
