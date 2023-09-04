import { Injectable, UnauthorizedException } from '@nestjs/common';
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
