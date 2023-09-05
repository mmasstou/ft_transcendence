import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { UserService } from 'src/users/user.service';

@WebSocketGateway({ namespace: 'dm' })
export class DmGateway implements OnGatewayConnection {
  constructor(
    private readonly usersService: UserService,
    private messageservice: MessagesService,
  ) {}
  @WebSocketServer()
  server: Server;
  async handleConnection(socket: Socket) {
    // console.log('+> handleConnection');
    const User = await this.usersService.getUserInClientSocket(socket);
    if (!User) {
      console.log('+++++++++++++++handleConnection -> User not exist');
      socket.emit('removeToken', null);
    }
    if (User) {
      // console.log('handleConnection for %s , socket %s', User.login, socket.id);
      this.server.emit('ref', { socketId: socket.id });
      socket.emit('offline-connection');
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
