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
import { User, Messages } from '@prisma/client';
import { error } from 'console';
import { RoomsService } from './rooms/rooms.service';
import { MessagesService } from './messages/messages.service';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export let _User: User | null = null;
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UserService,
    private roomservice: RoomsService,
    private messageservice: MessagesService,
  ) {}

  async handleConnection(socket: Socket) {
    const { token } = socket.handshake.auth; // Extract the token from the auth object
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
      console.log('Chat-> :%s |socket', payload.username, socket.id);
      _User = await this.usersService.findOne({ login });
    } catch {
      console.log('Chat-> error- +>', error);
    }
    // Perform any necessary validation or authorization checks with the token
    // ...

    // Proceed with the connection handling
    // ...
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinroom')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    try {
      console.log(`client with socket ${client.id} joined room ${data.id}`);
      console.log('socket +data.id-> :%s', data.id);
      console.log('socket +client.id-> :%s', client.id);
      console.log('socket +User.id-> :%s', _User.id);
      if (!client.rooms.has(data.id)) {
        await client.join(data.id);
        await this.messageservice.create({
          roomId: data.id,
          content: `userId : ${client.id} has connected`,
          userId: _User.id,
        });
      }
    } catch (error) {
      console.log('Chat-> error- +>', error);
    }
  }

  @SubscribeMessage('leaveroom')
  async LeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; messageContent: string },
  ) {
    try {
      const messages = await this.messageservice.create({
        roomId: data.roomId,
        content: `userId : ${client.id} has Leave room`,
        userId: _User.id,
      });
      client.emit('message', messages);
      client.leave(data.roomId);
    } catch (error) {}
  }

  @SubscribeMessage('sendMessage')
  async handleEvent(@MessageBody() data: any) {
    let messages: any;
    try {
      console.table(data);

      // const numClients = this.server.sockets.adapter.rooms.get(
      //   data.roomId,
      // ).size;
      // console.log(`Number of clients in myRoom: ${numClients}`);
      // console.log(`${user.name} [${user.id}] join to room : ${user.roomId}`);
      console.log('we are emmiting the message to room :', data.roomsId);
      this.server.to(data.roomsId).emit('message', "ddfdf");
      // this.server.emit('message', messages);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log('Chat-> error- +>', error);
      }
    }
  }
}
