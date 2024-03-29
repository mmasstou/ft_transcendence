import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { FriendshipStatus, Prisma, User, UserSocket } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dtos/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactorAuthenticationSecret: secret,
      },
    });
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFA: true,
      },
    });
  }

  async turnOffTwoFactorAuthentication(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
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
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) throw new Error('user not found');
      return user;
    } catch (error) {
      console.log('findOne error :', error.message);
      return null;
    }
  }
  async findOneLogin(params: { login: string }): Promise<User> {
    const { login } = params;
    return await this.prisma.user.findUnique({
      where: { login },
    });
  }

  async findAll(kind?: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { kind },
      include: {
        Rooms: true,
      },
    });
  }
  // send friend request
  async sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
    try {
      const existingRequest = await this.prisma.friendship.findFirst({
        where: {
          userId: senderId,
          friendId: receiverId,
          status: 'PENDING' || 'ACCEPTED',
        },
      });

      if (existingRequest) {
        throw new BadRequestException('Friend request already sent.');
      }

      await this.prisma.friendship.create({
        data: {
          User: {
            connect: { id: senderId },
          },
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
  // i should add both users to each other friends list
  async acceptFriendRequest(
    receiverId: string,
    senderId: string,
    id: string,
  ): Promise<void> {
    try {
      const existingRequest = await this.prisma.friendship.findFirst({
        where: {
          userId: senderId,
          friendId: receiverId,
        },
      });

      if (!existingRequest) {
        throw new BadRequestException('Friend request not found.');
      }

      const dm = await this.prisma.directMessage.create({
        data: {
          User: {
            connect: [{ id: receiverId }, { id: senderId }],
          },
        },
      });

      await this.prisma.friendship.update({
        where: {
          id: id,
        },
        data: {
          status: 'ACCEPTED',
          dm: {
            connect: {
              id: dm.id,
            },
          },
        },
      });

      await this.prisma.friendship.create({
        data: {
          User: {
            connect: { id: receiverId },
          },
          friendId: senderId,
          status: FriendshipStatus.ACCEPTED,
          dm: {
            connect: {
              id: dm.id,
            },
          },
        },
      });
      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // reject friend request

  async rejectFriendRequest(receiverId: string, senderId: string, id: string) {
    try {
      const existingRequest = await this.prisma.friendship.findFirst({
        where: {
          userId: senderId,
          friendId: receiverId,
        },
      });

      if (!existingRequest) {
        throw new BadRequestException('Friend request not found.');
      }

      await this.prisma.friendship.update({
        where: {
          id: id,
        },
        data: {
          status: 'DECLINED',
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
      // find dm and delete it
      // const dm = await this.prisma.directMessage.findFirst({
      //   where: {
      //     AND: [
      //       {
      //         User: {
      //           some: {
      //             id: friendId,
      //           },
      //         },
      //       },
      //       {
      //         User: {
      //           some: {
      //             id: userId,
      //           },
      //         },
      //       },
      //     ],
      //   },
      // });
      // if (dm) {
      //   await this.prisma.directMessage.delete({
      //     where: {
      //       id: dm.id,
      //     },
      //   });
      // }
      if (deletedFriendships.count === 0) throw new NotFoundException();
      return deletedFriendships;
    } catch (error) {
      throw new BadRequestException(error.message);
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
      return friendRequests;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // get all accepted friends
  async getFriends(userId: string) {
    try {
      const friends = await this.prisma.friendship.findMany({
        where: {
          OR: [
            // {
            //   userId: userId,
            //   status: 'ACCEPTED',
            // },
            {
              friendId: userId,
              status: 'ACCEPTED',
            },
          ],
        },
      });
      if (!friends) throw new NotFoundException();

      // get array of objects of eah friend with his data
      const friendsData = await Promise.all(
        friends.map(async (friend) => {
          const user = await this.prisma.user.findUnique({
            where: { id: friend.userId },
          });
          return user;
        }),
      );
      return friendsData;
      // get only array of friends id
      // const friendsId = friends.map((friend) => friend.userId);
      // return friendsId;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllSendingRequests(userId: string) {
    try {
      const friends = await this.prisma.friendship.findMany({
        where: {
          userId: userId,
          status: 'PENDING',
        },
      });
      if (!friends) throw new NotFoundException();
      return friends;
    } catch (error) {
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
    }
  }

  // get all non friend users and non pending users
  async getNonFriends(userId: string) {
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
      const friendsId = friends.map((friend) => friend.userId);
      const users = await this.prisma.user.findMany({
        where: {
          id: {
            notIn: friendsId,
          },
        },
      });
      if (!users) throw new NotFoundException();
      //get all pending requests
      const pendingRequests = await this.prisma.friendship.findMany({
        where: {
          userId: userId,
          status: 'PENDING',
        },
      });

      // remove all users that have pending requests
      pendingRequests.forEach((pending) => {
        users.forEach((user, index) => {
          if (user.id === pending.friendId) {
            users.splice(index, 1);
          }
        });
      });
      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // End Friends Actions

  async create(data: Prisma.UserCreateInput): Promise<User> {
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

  // get User in cluent socket
  async getUserInClientSocket(client: Socket) {
    const { token } = client.handshake.auth; // Extract the token from the auth object
    let payload: any = '';
    try {
      if (!token) {
        throw new UnauthorizedException();
      }
      // console.log('token exist');
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // console.log('payload exist :', payload);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const id: string = payload.userId;
      // console.log('payload :', payload);
      // Add your logic to fetch the direct messages for the user from the database or any other source
      const user = await this.findOne({ id });
      if (!user) throw new NotFoundException();
      return user;
    } catch (error) {
      // console.log('Socket %s Disconnected', client.id);
      console.log('catch connection error :', error.message);
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
      throw new BadRequestException(error.message);
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
