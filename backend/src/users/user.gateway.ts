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
import { Members, RoomType, Rooms, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { userType } from './user.type';

export const clientOnLigne = new Map<string, Socket[]>();
@WebSocketGateway({ namespace: 'User' })
export class UserGateway implements OnGatewayConnection {
  constructor(
    private readonly usersService: UserService,
    private prisma: PrismaService,
  ) {}

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

  @SubscribeMessage('DenyGame')
  async handleDenyGame(
    @MessageBody() data: { userId: string; sender: any; mode: string },
    @ConnectedSocket() client: Socket,
  ) {
    const Response = {
      response: 'Deny',
      sender: data.sender,
      userId: data.userId,
      mode: data.mode,
    };
    const User = await this.usersService.getUserInClientSocket(client);
    // const sender = await this.usersService.getUserById(data.userId);
    console.log('User-> data :', data);
    this.server.emit('GameResponse', Response);
  }

  // sendMessageToSocket(socket: Socket, message: any) {
  //   // send GameNotificationResponse to user
  //   socket.emit('GameNotificationResponse', message);
  // }

  @SubscribeMessage('FriendToAddToChanneL')
  async FriendToAddToChanneL(
    @MessageBody() data: { searchquery?: string; channeL: Rooms },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      let Friends: User[] | undefined = undefined;
      const User = await this.usersService.getUserInClientSocket(client);
      if (!User) return;

      console.log('User :', User);
      console.log('searchquery :', data.searchquery);
      console.log('channeL :', data.channeL);
      if (data.searchquery) {
        Friends = await this.prisma.user.findMany({
          where: {
            login: {
              contains: data.searchquery, // Replace with your actual search input
            },
          },
        });
      } else {
        Friends = await this.prisma.user.findMany();
      }

      const ChanneLmembers: Members[] = await this.prisma.members.findMany({
        where: {
          roomsId: data.channeL.id,
        },
      });
      if (ChanneLmembers) {
        for (let index = 0; index < ChanneLmembers.length; index++) {
          const member = ChanneLmembers[index];

          Friends = Friends.filter(
            (friend: User) => friend.id !== member.userId,
          );
        }
      }

      client.emit('FriendToAddToChanneLResponse', Friends);
    } catch (error) {
      console.log('Find Friend To Add To ChanneL error ');
    }
  }
}
