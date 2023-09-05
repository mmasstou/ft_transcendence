import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Messages, User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { UserService } from 'src/users/user.service';
import { DmService } from './dm.service';

@WebSocketGateway({ namespace: 'dm' })
export class DmGateway implements OnGatewayConnection {
  constructor(
    private readonly usersService: UserService,
    private messageservice: MessagesService,
    private dmService: DmService,
  ) {}
  @WebSocketServer()
  server: Server;
  async handleConnection(socket: Socket) {
    // console.log('+> handleConnection');
    const User: User = await this.usersService.getUserInClientSocket(socket);
    if (!User) {
      socket.emit('removeToken', null);
    }
    if (User) {
      if (!this.dmService.connectToALLDm(User, socket)) {
        console.log('error in join to all dm');
      }
      // console.log('handleConnection for %s , socket %s', User.login, socket.id);
      this.server.emit('ref', { socketId: socket.id });
      socket.emit('offline-connection');
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: any,
    payload: {
      content: string;
      senderId: string;
      dmId: string;
    },
  ) {
    try {
      const md = await this.dmService.findOne(payload.dmId);

      if (!md) throw new Error('Dm not found');
      const User = await this.usersService.findOne({ id: payload.senderId });
      if (!User) throw new Error('User not found');
      const message: Messages = await this.messageservice.create({
        DirectMessage: md.id,
        content: payload.content,
        userId: User.id,
      });

      // const isInroomSocket = client.rooms.has(md.id) || false;

      this.server.to(md.id).emit('message', message);
    } catch (error) {
      console.log('DmGateway -> handleMessage -> error', error.message);
    }
  }
}
