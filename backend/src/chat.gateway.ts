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
import { User, UserType } from '@prisma/client';
import { error } from 'console';
import { RoomsService } from './rooms/rooms.service';
import { MessagesService } from './messages/messages.service';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { MembersService } from './members/members.service';
import { PrismaService } from './prisma.service';

export let _User: User | null = null;
enum updatememberEnum {
  SETADMIN = 'SETADMIN',
  BANMEMBER = 'BANMEMBER',
  KIKMEMBER = 'KIKMEMBER',
  MUTEMEMBER = 'MUTEMEMBER',
  PLAYGAME = 'PLAYGAME',
  SETOWNER = 'SETOWNER',
  ACCESSPASSWORD = 'ACCESSPASSWORD',
}
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UserService,
    private roomservice: RoomsService,
    private messageservice: MessagesService,
    private memberService: MembersService,
    private prisma: PrismaService,
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
      const id: string = payload.login;
      console.log('Chat-> handleConnection +> payload :', payload.login);
      _User = await this.usersService.findOne({ id });
    } catch {
      console.log('Chat-handleConnection> error- +>', error);
    }
    // Perform any necessary validation or authorization checks with the token
    // ...

    // Proceed with the connection handling
    // ...
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('updatemember')
  async updatemember(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      updateType: string;
      member: any;
    },
  ) {
    try {
      const __member = await this.memberService.findOne({
        userId: data.member.userId,
        roomId: data.member.roomsId,
      });
      if (data.updateType === updatememberEnum.SETADMIN) {
        const type: UserType =
          __member.type === UserType.ADMIN ? UserType.USER : UserType.ADMIN;
        const member = await this.prisma.members.update({
          where: { id: data.member.id },
          data: { type: type },
        });
        this.server.emit('updatememberResponseEvent', member);
      }
      // ban member :
      if (data.updateType === updatememberEnum.BANMEMBER) {
        const __isBan: boolean = __member.isban === true ? false : true;
        const member = await this.prisma.members.update({
          where: { id: data.member.id },
          data: { isban: __isBan },
        });
        this.server.emit('updatememberResponseEvent', member);
      }
      // mute member :
      if (data.updateType === updatememberEnum.MUTEMEMBER) {
        const __isMute: boolean = __member.ismute === true ? false : true;
        const member = await this.prisma.members.update({
          where: { id: data.member.id },
          data: { ismute: __isMute },
        });
        this.server.emit('updatememberResponseEvent', member);
      }
      // kick member :
      if (data.updateType === updatememberEnum.KIKMEMBER) {
        const member = await this.prisma.members.delete({
          where: { id: data.member.id },
        });
        this.server.emit('updatememberResponseEvent', member);
      }
      // set owner :
      if (data.updateType === updatememberEnum.SETOWNER) {
        const type: UserType =
          __member.type === UserType.OWNER ? UserType.USER : UserType.OWNER;
        const member = await this.prisma.members.update({
          where: { id: data.member.id },
          data: { type: type },
        });
        this.server.emit('updatememberResponseEvent', member);
      }
      // create room :
    } catch (error) {
      console.log('Chat-updatemember> error- +>', error);
    }
  }
  @SubscribeMessage('joinmember')
  async joinmember(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      userid: string;
      roomid: string;
    },
  ) {
    try {
      let member: any = null;
      // check if member is already in room database :
      try {
        const room = await this.roomservice.findOne({ name: data.roomid });
        member = await this.prisma.members.findFirst({
          where: { userId: data.userid, roomsId: room.id },
        });
        if (!member) {
          member = await this.memberService.create({
            type: UserType.USER,
            user: data.userid,
            roomId: room.id,
          });
        }
        await this.prisma.rooms.update({
          where: { id: room.id },
          data: {
            members: { connect: { id: member.id } },
            User: { connect: { id: data.userid } },
          },
        });
        client.emit('joinmemberResponseEvent', member);
      } catch (error) {
        console.log('Chat-> joinmember error- +>', error);
      }
      // create room :
      // const newRoom = await this.roomservice.create(data, _User.login);

      // send message that room is created :
      // this.server.emit('createroomResponseEvent', newRoom);
    } catch (error) {
      console.log('Chat-joinmember> error- +>', error);
    }
  }
  @SubscribeMessage('createroom')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      // console.log(
      //   'Chat-> createroom +> user :%s has create room :%s',
      //   _User.login,
      //   data,
      // );
      // create room :
      const newRoom = await this.roomservice.create(data, _User.login);

      // send message that room is created :
      this.server.emit('createroomResponseEvent', newRoom);
    } catch (error) {
      console.log('Chat-createRoom> error- +>', error);
    }
  }

  @SubscribeMessage('joinroom')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    try {
      // get room from database :
      const room = await this.roomservice.findOne({ name: data.id });
      // get user from client :
      const LogedUser = await this.usersService.getUserInClientSocket(client);
      console.log(
        'Chat-> joinRoom +> user :%s has join to room :%s',
        LogedUser.login,
        room.name,
      );
      // check if member is already in room database :
      const _isMemberInRoom = await this.roomservice.isMemberInRoom(
        data.id,
        LogedUser.id,
      );
      // console.log('Chat-> responseMemberData- +>', responseMemberData);
      if (_isMemberInRoom !== null && !client.rooms.has(data.id)) {
        await client.join(data.id);
      }
    } catch (error) {
      console.log('Chat-joinRoom> error- +>', error);
    }
  }

  @SubscribeMessage('leaveroom')
  async LeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; messageContent: string },
  ) {
    try {
      client.leave(data.roomId);
    } catch (error) {}
  }

  @SubscribeMessage('sendMessage')
  async handleEvent(@MessageBody() data: any) {
    let messages: any;
    try {
      messages = await this.messageservice.create({
        roomId: data.roomsId,
        content: data.content,
        userId: data.senderId,
      });
      // console.table(messages);
      this.server.to(data.roomsId).emit('message', messages);
      // this.server.emit('message', messages);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log('Chat-sendMessage> error- +>', error);
      }
    }
  }

  @SubscribeMessage('updateChanneL')
  async updateChanneL(@MessageBody() data: any) {
    try {
      // console.log('Chat-> updateChanneL +> data :', data);
      const room = await this.roomservice.findOne({ name: data.id });

      const responseMemberData = await this.roomservice.isMemberInRoom(
        room.id,
        _User.id,
      );
      if (responseMemberData.type === UserType.OWNER) {
        // console.log('Chat-> responseMemberData- +>', responseMemberData);

        const dataRoom = {
          name: room.name,
          type: data.type,
          password: data.password,
        };
        const updateRoom = await this.prisma.rooms.update({
          where: { id: room.id },
          data: dataRoom,
        });
        this.server.emit('updateChanneLResponseEvent', updateRoom);
      }
    } catch (error) {
      console.log('Chat-updateChanneL> error- +>', error);
    }
  }
}
