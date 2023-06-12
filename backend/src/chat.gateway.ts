import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
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
    console.log('Received token:', token);
    console.log('socket id:', socket.id);
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
      console.log('payload :', payload);
      const login: string = payload.sub;
      _User = await this.usersService.findOne({ login });
      console.log('user :', _User);
    } catch {
      console.log('+>', error);
    }
    // Perform any necessary validation or authorization checks with the token
    // ...

    // Proceed with the connection handling
    // ...
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  async handleEvent(
    @MessageBody() data: { roomId: string; messageContent: string },
  ) {
    try {
      console.log('+++++++++++++++++++|> MessageBody :', data);
      console.log('+++++++++++++++++++|> sendMessage :', _User);
      const messages = await this.messageservice.create({
        roomId: data.roomId,
        content: data.messageContent,
        userId: _User.id,
      });

      this.server.emit('message', messages);
    } catch (error) {}
  }
}
