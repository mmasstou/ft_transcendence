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
      console.log(
        'Chat-> updatemember +> user :%s has create room :%s',
        _User.login,
        data,
      );
      // type: UserType.ADMIN,
      // id: data.member.id,
      console.log('Chat-> __member- ---------+>', data.member);
      // update member in channeL:
      // set admin :
      const __member = await this.memberService.findOne({
        userId: data.member.userId,
        roomId: data.member.roomsId,
      });
      if (data.updateType === updatememberEnum.SETADMIN) {
        console.log('Chat-> __member- +>', __member);

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
      console.log('Chat-> error- +>', error);
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
      console.log('Chat-> joinmember +>');
      console.log('Chat-> joinmember +> data :', data);
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
        console.log('Chat-> joinmember +> member :', member);
        client.emit('joinmemberResponseEvent', member);
      } catch (error) {
        console.log('Chat-> joinmember error- +>', error);
      }
      // create room :
      // const newRoom = await this.roomservice.create(data, _User.login);

      // send message that room is created :
      // this.server.emit('createroomResponseEvent', newRoom);
    } catch (error) {
      console.log('Chat-> error- +>', error);
    }
  }
  @SubscribeMessage('createroom')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      console.log(
        'Chat-> createroom +> user :%s has create room :%s',
        _User.login,
        data,
      );
      // create room :
      const newRoom = await this.roomservice.create(data, _User.login);

      // send message that room is created :
      this.server.emit('createroomResponseEvent', newRoom);
    } catch (error) {
      console.log('Chat-> error- +>', error);
    }
  }

  @SubscribeMessage('joinroom')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    try {
      console.log(`client with socket ${client.id} joined room ${data.id}`);
      console.log('socket +data.id-> :%s', data.id);
      console.log('socket +client.id-> :%s', client.id);
      console.log('socket +User.id-> :%s', _User.id);
      console.log(
        'Chat-> ChanneL +> user :%s has join to room :%s',
        _User.login,
        data,
      );
      // check if user is already in room database :
      const room = await this.roomservice.findOne({ name: data.id });
      const responseMemberData = await this.roomservice.isMemberInRoom(
        room.id,
        _User.id,
      );
      console.log('Chat-> responseMemberData- +>', responseMemberData);
      if (!client.rooms.has(data.id)) {
        await client.join(data.id);
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
      console.table(messages);
      this.server.to(data.roomsId).emit('message', messages);
      // this.server.emit('message', messages);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log('Chat-> error- +>', error);
      }
    }
  }
}
