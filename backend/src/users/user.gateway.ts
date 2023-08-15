import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user.service';

export const clientOnLigne = new Map<string, Socket[]>();
@WebSocketGateway({ namespace: 'User' })
export class UserGateway implements OnGatewayConnection {
  constructor(private readonly usersService: UserService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const User = await this.usersService.getUserInClientSocket(socket);
    if (User) {
      console.log('User-> %s connected with socketId :', User.login, socket.id);
      // check if user is already connected
      if (clientOnLigne.has(User.id)) {
        const ListSocket = clientOnLigne.get(User.id);
        clientOnLigne.set(User.id, [...ListSocket, socket]);
        // clientOnLigne.get(User.id).push(socket.id);
      } else clientOnLigne.set(User.id, [socket]);
      //   console.log('++handleConnection++clientOnLigne> : %s ->', User.login);
      //   clientOnLigne.get(User.id).forEach((socket) => {
      //     console.log(socket.id);
      //   });
      return User;
    }
  }
  //   on client socket disconnect remove socket.id from clientOnLigne that disconnected
  @SubscribeMessage('disconnect')
  async handleDisconnect(socket: Socket) {
    const User = await this.usersService.getUserInClientSocket(socket);
    if (User) {
      if (clientOnLigne.has(User.id)) {
        const ListSocket = clientOnLigne.get(User.id);
        const index = ListSocket.indexOf(socket);
        if (index > -1) {
          ListSocket.splice(index, 1);
          clientOnLigne.set(User.id, ListSocket);
        }
        // console.log('--handleDisconnect--clientOnLigne> : %s ->', User.login);
        console.table(clientOnLigne.get(User.id));
      }
      return User;
    }
  }

  @SubscribeMessage('AcceptGame')
  async handleAcceptGame(
    @MessageBody() data: { userId: string; sender: any; mode: string },
    @ConnectedSocket() client: Socket,
  ) {
    const Response = {
      response: 'Accept',
      sender: data.sender,
      userId: data.userId,
      mode: data.mode,
    };
    const User = await this.usersService.getUserInClientSocket(client);
    // const sender = await this.usersService.getUserById(data.userId);
    console.log('User-> data :', data);
    this.server.emit('GameResponse', Response);
  }

  sendMessageToSocket(socket: Socket, message: any) {
    // send notificationEvent to user
    socket.emit('notificationEvent', message);
  }
}
