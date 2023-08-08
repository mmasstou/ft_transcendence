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
import { Members, RoomType, Rooms, User, UserType } from '@prisma/client';
import { error } from 'console';
import { RoomsService } from './rooms/rooms.service';
import { MessagesService } from './messages/messages.service';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { MembersService } from './members/members.service';
import { PrismaService } from './prisma.service';
import { clientOnLigne } from './user.gateway';
import { RoomsType, membersType } from './users/user.type';
import {
  UpdateChanneLSendData,
  UpdateChanneLSendEnum,
} from './rooms/types/upatecahnnel';
import { AppService } from './app.service';
import { JoinStatusEnum } from './rooms/types/room.joinStatus';
import e from 'express';

enum updatememberEnum {
  SETADMIN = 'SETADMIN',
  BANMEMBER = 'BANMEMBER',
  KIKMEMBER = 'KIKMEMBER',
  MUTEMEMBER = 'MUTEMEMBER',
  PLAYGAME = 'PLAYGAME',
  SETOWNER = 'SETOWNER',
  ACCESSPASSWORD = 'ACCESSPASSWORD',
}
export enum responseEventStatusEnum {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
export enum responseEventMessageEnum {
  WELLCOMEBACK = 'Wellcom back to room',
  WELLCOME = 'Wellcome to room',
  BAN = 'you are ban from this room',
  MUTED = 'you are muted from this room',
  KIKED = 'you are kiked from this room',
  SETADMIN = 'you are admin now',
  SETOWNER = 'you are owner now',
  PLAYGAME = 'playing game now',
  CANTJOIN = 'you cant join to this room',
}
export type responseEvent = {
  status: responseEventStatusEnum;
  message: responseEventMessageEnum;
  data: Rooms | Members | User | null;
};
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UserService,
    private roomservice: RoomsService,
    private messageservice: MessagesService,
    private memberService: MembersService,
    private prisma: PrismaService,
    private readonly appservice: AppService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    // const status = await this.appservice.handleSocketConnection(socket);
    // if (!status) socket.disconnect();
    const User = await this.usersService.getUserInClientSocket(socket);
    User &&
      console.log('Chat-> %s connected +> socket :', User.login, socket.id);
  }

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
        const result = await this.prisma.$transaction([
          this.prisma.rooms.update({
            where: { id: data.member.roomsId },
            data: { members: { disconnect: { id: data.member.id } } },
          }),
          this.prisma.members.delete({
            where: { id: data.member.id },
          }),
        ]);
        this.server.emit('updatememberResponseEvent', result);
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
  @SubscribeMessage(`${process.env.SOCKET_EVENT_JOIN_MEMBER}`)
  async joinmember(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      userId: string;
      roomId: string;
    },
  ) {
    const ResponseEventData: responseEvent = {
      status: responseEventStatusEnum.SUCCESS,
      message: responseEventMessageEnum.WELLCOME,
      data: null,
    };
    try {
      const room = await this.roomservice.findOne({ id: data.roomId });

      // check if member is already in room database :
      const existMember = await this.memberService.findOne({
        userId: data.userId,
        roomId: room.id,
      });
      if (existMember) {
        // check if member is ban :
        if (existMember.isban) {
          ResponseEventData.status = responseEventStatusEnum.ERROR;
          ResponseEventData.message = responseEventMessageEnum.BAN;
          ResponseEventData.data = existMember;
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            ResponseEventData,
          );
          return;
        }
        // update member :
        const member = await this.memberService.update({
          id: existMember.id,
          ismute: false,
          type: UserType.USER,
        });
        // add member to room :
        const roomJoined = await this.roomservice.joinToRoom(
          data.userId,
          member.id,
          room.id,
        );
        ResponseEventData.status = responseEventStatusEnum.SUCCESS;
        ResponseEventData.message = responseEventMessageEnum.WELLCOMEBACK;
        ResponseEventData.data = roomJoined;
        // send response to client :
        client.emit(
          `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
          ResponseEventData,
        );
        return;
      }
      // create member :
      const member = await this.memberService.create({
        user: data.userId,
        roomId: data.roomId,
        type: UserType.USER,
      });
      // add member to room :
      const roomJoined = await this.roomservice.joinToRoom(
        data.userId,
        member.id,
        room.id,
      );
      ResponseEventData.status = responseEventStatusEnum.SUCCESS;
      ResponseEventData.message = responseEventMessageEnum.WELLCOME;
      ResponseEventData.data = roomJoined;
      // send response to client :
      client.emit(
        `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
        ResponseEventData,
      );
      return;
    } catch (error) {
      console.log('Chat-> joinmember error- +>', error);
      // send response to client :
      ResponseEventData.status = responseEventStatusEnum.ERROR;
      ResponseEventData.message = responseEventMessageEnum.CANTJOIN;
      ResponseEventData.data = null;
      client.emit(
        `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
        ResponseEventData,
      );
    }
    // send event to all client  that member is join to room :
    this.server.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, null);
  }
  @SubscribeMessage('createroom')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const LogedUser = await this.usersService.getUserInClientSocket(client);
      if (!LogedUser) {
        return;
      }
      // check if room name is exist :
      const ExistChannel = await this.roomservice.findOne(data.name);
      if (ExistChannel) client.emit('createroomResponseEvent', null);
      // console.log(
      //   'Chat-> createroom +> user :%s has create room :%s',
      //   _User.login,
      //   data,
      // );
      // create room :
      const newRoom = await this.roomservice.create(data, LogedUser.login);
      client.emit('createroomResponseEvent', newRoom);
      // send message that room is created :
      this.server.emit(
        `${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
        newRoom,
      );
    } catch (error) {
      console.log('Chat-createRoom> error- +>', error);
    }
  }

  @SubscribeMessage('deleteChannel')
  async deleteRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    console.log('Chat-> responseMemberData- +>', data);
    const room = await this.roomservice.findOne({ id: data.room.id });
    const LogedUser = await this.usersService.getUserInClientSocket(client);
    if (!LogedUser) {
      return;
    }
    const responseMemberData = await this.roomservice.isMemberInRoom(
      room.id,
      LogedUser.id,
    );
    if (responseMemberData && responseMemberData.type === UserType.OWNER) {
      const deleteRoom = await this.roomservice.remove(room.id);
      if (deleteRoom) {
        client.emit('deleteChannelResponseEvent', deleteRoom);
        this.server.emit('ChatUpdate', deleteRoom);
      }
      this.server.emit('deleteroomResponseEvent', null);
    }
  }

  @SubscribeMessage('JoinRoom')
  async JoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; roomId: string },
  ) {
    const User = await this.usersService.findOne({ id: data.userId });
    const Room = await this.roomservice.findOne({ id: data.roomId });
    if (!User || !Room) return;

    // check if member is already in room database :
    const _isMemberInRoom = await this.roomservice.isMemberInRoom(
      data.roomId,
      data.userId,
    );
    console.log('Chat-> responseMemberData- +>', _isMemberInRoom);
    if (_isMemberInRoom !== null && !client.rooms.has(data.roomId)) {
      // await client.join(data.roomId);
      // send response to client :
      console.log('Chat-> JoinRoom +> user :', User.login);
    }
    client.emit('JoinRoomResponseEvent', {
      status: JoinStatusEnum.JOINED,
      message: 'you are not member or not in the socket channel yet',
    });
  }

  @SubscribeMessage('accessToroom')
  async AccesstoRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      // get room from database :
      const room = await this.roomservice.findOne({ id: data.id });
      // get user from client :
      const LogedUser = await this.usersService.getUserInClientSocket(client);
      if (!LogedUser) return;
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
        // send response to client :
        client.emit('joinroomResponseEvent', room);
      } else
        client.emit('joinroomResponseEvent', {
          error: 'you are not member or not in the socket channel yet',
        });
    } catch (error) {
      console.log('Chat-joinRoom> error- +>', error);
      client.emit('joinroomResponseEvent', {
        error: 'somthing worreng in the server',
      });
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
  async updateChanneL(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UpdateChanneLSendData,
  ) {
    try {
      console.log('Chat-> updateChanneL +> data :', data);
      const room = await this.roomservice.findOne({ id: data.room.id });
      const LogedUser = await this.usersService.getUserInClientSocket(client);
      if (!LogedUser) return;
      const responseMemberData = await this.roomservice.isMemberInRoom(
        room.id,
        LogedUser.id,
      );
      if (responseMemberData.type === UserType.OWNER) {
        // console.log('Chat-> responseMemberData- +>', responseMemberData);
        // check type of update :
        // change type of room :
        if (data.Updatetype === UpdateChanneLSendEnum.CHANGETYPE) {
          const dataRoom = {
            name: room.name,
            type: data.roomtype,
            accesspassword: data.accesspassword,
            password: data.password,
          };
          const updateRoom = await this.prisma.rooms.update({
            where: { id: room.id },
            data: {
              ...dataRoom,
            },
          });
          console.log('Chat-> updateChanneL +> updateRoom :', updateRoom);
          client.emit('updateChanneLResponseEvent', updateRoom);
          this.server.emit('ChatUpdate', updateRoom);
        }
        // set access password :
        if (data.Updatetype === UpdateChanneLSendEnum.SETACCESSEPASSWORD) {
          const dataRoom = {
            accesspassword: data.accesspassword,
            hasAccess: true,
          };
          const updateRoom = await this.prisma.rooms.update({
            where: { id: room.id },
            data: {
              ...dataRoom,
            },
          });
          console.log('Chat-> updateChanneL +> updateRoom :', updateRoom);
          client.emit('updateChanneLResponseEvent', updateRoom);
          this.server.emit('ChatUpdate', updateRoom);
        }
      }
    } catch (error) {
      console.log('Chat-updateChanneL> error- +>', error);
    }
  }
  @SubscribeMessage('sendNotification')
  async sendNotification(
    @MessageBody() data: { userId: string; room: RoomsType },
  ) {
    try {
      // console.log('Chat-> sendNotification +> data :', data);
      // git owner of room :
      const sendedUser = await this.usersService.findOne({ id: data.userId });
      const owner: Members[] = await this.roomservice.findOwnerRooms(
        data.room.id,
      );
      if (owner) {
        owner.forEach(async (member: Members) => {
          const ListSocket = clientOnLigne.get(member.userId);
          if (ListSocket) {
            const User = await this.usersService.findOne({
              id: member.userId,
            });
            ListSocket.forEach((socket) => {
              socket.emit('notificationEvent', {
                message: `ask to join to room ${data.room.name}`,
                User: User,
                member: member,
                sendedUser: sendedUser,
              });
            });
          }
        });
      }
    } catch (error) {
      console.log('Chat-sendNotification> error- +>', error);
    }
  }
}
