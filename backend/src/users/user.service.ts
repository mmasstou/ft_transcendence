import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
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
        directMessage: true,
        cursus_users: true,
      },
    });
  }

  // Friends Actions

  // send friend request
  async sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
    try {
      const existingRequest = await this.prisma.friendship.findFirst({
        where: {
          userId: senderId,
          friendId: receiverId,
        },
      });

      if (existingRequest) {
        throw new BadRequestException('Friend request already sent.');
      }

      await this.prisma.friendship.create({
        data: {
          userId: senderId,
          friendId: receiverId,
          status: 'PENDING',
        },
      });
      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // accept friend request
  // async acceptFriendRequest(
  //   senderId: string,
  //   receiverId: string,
  // ): Promise<void> {
  //   try {
  //     const existingRequest = await this.prisma.friendship.findFirst({
  //       where: {
  //         userId: senderId,
  //         friendId: receiverId,
  //       },
  //     });

  //     if (!existingRequest) {
  //       throw new BadRequestException('Friend request not found.');
  //     }

  //     await this.prisma.friendship.update({
  //       where: {
  //         userId: senderId,
  //         friendId: receiverId,
  //       },
  //       data: {
  //         status: 'ACCEPTED',
  //       },
  //     });
  //     return;
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async removeFriend(friendId: string, userId: string) {
    try {
      const deletedFriendships = await this.prisma.friendship.deleteMany({
        where: {
          OR: [
            {
              userId: userId,
              friendId: friendId,
            },
            {
              userId: friendId,
              friendId: userId,
            },
          ],
        },
      });
      if (deletedFriendships.count === 0) throw new NotFoundException();
      return deletedFriendships;
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  }

  async isFriend(userId: string, friendId: string) {
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
    if (existingFriendship) return true;
    return false;
  }

  async getFriends(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        friends: true,
      },
    });
    if (!user) return [];
    const friends = user.friends;
    if (!friends) return [];
    return friends;
  }

  // End Friends Actions

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

  isLoginValid(login: string): boolean {
    if (login.length < 6) return false;
    if (login.length > 8) return false;
    if (!login.match(/^[A-z][A-z0-9-_]{5,7}$/)) return false;
    return true;
  }
}
