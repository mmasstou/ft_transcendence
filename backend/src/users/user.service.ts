import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
import { User, Prisma, UserSocket } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async findOne(params: { id: string }): Promise<any> {
    const { id } = params;
    // console.log('++findOne++>', login);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return {};
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

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const Req_Data: Prisma.UserCreateInput = data;
    if (Req_Data.is_active === true && Req_Data.login !== 'mmasstou')
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

  // get User in cluent socket
  async getUserInClientSocket(client: Socket) {
    const { token } = client.handshake.auth; // Extract the token from the auth object
    let payload: any = '';
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
        cursus_users: true,
      },
    });
    return user;
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
      console.log('++createUserSocket++userSocket>', userSocket);
      return userSocket;
    } catch (error) {
      console.log('++createUserSocket++error>', error);
      return null;
    }
  }
}
