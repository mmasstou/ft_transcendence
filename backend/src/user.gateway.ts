import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './users/user.service';
import { User } from '@prisma/client';
import { error } from 'console';
import { RoomsService } from './rooms/rooms.service';
import { MessagesService } from './messages/messages.service';
import { PrismaService } from './prisma.service';

export let _User: User | null = null;
@WebSocketGateway({ namespace: 'User' })
export class UserGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UserService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(socket: Socket) {
    const { token } = socket.handshake.auth; // Extract the token from the auth object
    // console.log('token', token);
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
      const login: string = payload.sub;
      const result = await this.prisma.$transaction(async (prisma) => {
        _User = await this.usersService.findOne({ login });

        const UserSocketId = await prisma.userSocket.findUnique({
          where: { userId: _User.id },
        });
        if (!UserSocketId) {
          return await prisma.userSocket.create({
            data: { socketId: socket.id, userId: _User.id },
          });
        } else {
          return await prisma.userSocket.update({
            where: { userId: _User.id },
            data: { socketId: socket.id },
          });
        }
      });
      //   console.log('User result', result);
      socket.emit('connected', { UserSocketId: result });
    } catch {
      console.log('+hna>', error);
    }
  }
}
