import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Res,
} from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
import { User, Prisma, UserSocket } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

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
  // get all  friend requests

  async getFriendRequests(userId: string) {
    try {
      const friendRequests = await this.prisma.friendship.findMany({
        where: {
          friendId: userId,
          status: 'PENDING',
        },
      });
      if (!friendRequests) throw new NotFoundException();
      console.log('++getFriendRequests++>:\n', friendRequests);
      return friendRequests;
    } catch (error) {
      console.log('++getFriendRequests++error>', error.message);
    }
  }

  // get all friends
  async getFriends(userId: string) {
    try {
      const friends = await this.prisma.friendship.findMany({
        where: {
          OR: [
            {
              userId: userId,
              status: 'ACCEPTED',
            },
            {
              friendId: userId,
              status: 'ACCEPTED',
            },
          ],
        },
      });
      if (!friends) throw new NotFoundException();
      return friends;
    } catch (error) {
      console.log('++getFriends++error>', error.message);
    }
  }

  async getFriend(id: string) {
    try {
      const friend = await this.prisma.friendship.findUnique({
        where: { id },
      });
      if (!friend) throw new NotFoundException();
      return friend;
    } catch (error) {
      console.log('++getFriend++error>', error.message);
    }
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

  // get User in cluent socket
  async getUserInClientSocket(client: Socket) {
    const { token } = client.handshake.auth; // Extract the token from the auth object
    let payload: any = '';
    try {
      if (!token) {
        throw new UnauthorizedException();
      }
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const login: string = payload.login;
      // Add your logic to fetch the direct messages for the user from the database or any other source
      const user = await this.prisma.user.findUnique({
        where: { login },
        include: {
          Rooms: true,
          directMessage: true,
        },
      });
      return user;
    } catch (error) {
      console.log('Socket %s Disconnected', client.id);
      client.emit('removeToken', null);
      client.disconnect();
    }
  }

  // get all clients socket from database; and return array of socket; if not return null
  async getUserSocket() {
    const UserSocket = await this.prisma.userSocket.findMany();
    if (!UserSocket) return null;
    return UserSocket;
  }
  // create client socket in database
  async createUserSocket(data: {
    userId: string;
    socketId: string;
  }): Promise<UserSocket | null> {
    try {
      const userSocket = await this.prisma.userSocket.create({
        data: {
          userId: data.userId,
          socketId: data.socketId,
        },
      });
      return userSocket;
    } catch (error) {
      console.log('++createUserSocket++error>', error);
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    enteredPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  async updateUserStatus(id: string, status: string) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        status: status,
      },
    });
  }
  isLoginValid(login: string): boolean {
    if (login.length < 6) return false;
    if (login.length > 8) return false;
    if (!login.match(/^[A-z][A-z0-9-_]{5,7}$/)) return false;
    return true;
  }
}
