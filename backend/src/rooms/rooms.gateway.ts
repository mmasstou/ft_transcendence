import { NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { Members, RoomType, Rooms, User, UserType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JoinStatusEnum } from './types/room.joinStatus';
import { UserService } from 'src/users/user.service';
import { RoomsService } from './rooms.service';
import { MessagesService } from 'src/messages/messages.service';
import { MembersService } from 'src/members/members.service';
import { PrismaService } from 'src/prisma.service';
import { AppService } from 'src/app.service';
import { UserTypeEnum } from 'src/users/user.type';
import {
  UpdateChanneLSendData,
  UpdateChanneLSendEnum,
} from './types/upatecahnnel';
import { clientOnLigne } from 'src/users/user.gateway';
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
  ERROR = 'error',
  SUCCESS = 'success',
  WELLCOMEBACK = 'Wellcom back to room',
  WELLCOME = 'Wellcome to room',
  BAN = 'you are ban from this room',
  MUTED = 'you are muted from this room',
  KIKED = 'you are kiked from this room',
  SETADMIN = 'you are admin now',
  SETOWNER = 'you are owner now',
  PLAYGAME = 'playing game now',
  CANTJOIN = 'you cant join to this room',
  CANTDELETE = 'you cant delete this room',
  DELETESUCCESS = 'room deleted',
  CHANNELEXIST = 'the channel name exist',
  CHANNELCREATED = 'Channel created success',
  LEAVEROOMSUCCESS = 'leaved room success',
}
export type responseEvent = {
  status: responseEventStatusEnum;
  message: responseEventMessageEnum;
  data: Rooms | Members | User | null;
};
@WebSocketGateway({ namespace: 'chat' })
export class RoomGateway implements OnGatewayConnection {
  constructor(
    private readonly usersService: UserService,
    private roomservice: RoomsService,
    private messageservice: MessagesService,
    private memberService: MembersService,
    private prisma: PrismaService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    // const status = await this.appservice.handleSocketConnection(socket);
    // if (!status) socket.disconnect();
    const User = await this.usersService.getUserInClientSocket(socket);
    User &&
      console.log('Chat-> %s connected with socketId :', User.login, socket.id);
  }

  @SubscribeMessage(`${process.env.SOCKET_EVENT_CHAT_MEMBER_UPDATE}`)
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
      try {
        if (data.updateType === updatememberEnum.SETADMIN) {
          const type: UserType =
            __member.type === UserType.ADMIN ? UserType.USER : UserType.ADMIN;
          const member = await this.prisma.members.update({
            where: { id: data.member.id },
            data: { type: type },
          });
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            member,
          );
        }
        // ban member :
        if (data.updateType === updatememberEnum.BANMEMBER) {
          const __isBan: boolean = __member.isban === true ? false : true;
          const member = await this.prisma.members.update({
            where: { id: data.member.id },
            data: { isban: __isBan },
          });
          // client.emit('updatememberResponseEvent', member);
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            member,
          );
        }
        // mute member :
        if (data.updateType === updatememberEnum.MUTEMEMBER) {
          const __isMute: boolean = __member.ismute === true ? false : true;
          const member = await this.prisma.members.update({
            where: { id: data.member.id },
            data: {
              ismute: __isMute,
              // mute_at: Date.now().toString(),
            },
          });
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            member,
          );
          if (member.ismute) {
            setTimeout(() => {
              const member = (async () => {
                return await this.prisma.members.update({
                  where: { id: data.member.id },
                  data: { ismute: false },
                });
              })();
              client.emit(
                `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
                member,
              );
            }, 10000);
          }
        }
        // kick member :
        if (data.updateType === updatememberEnum.KIKMEMBER) {
          const result = await this.prisma.$transaction(async (prisma) => {
            const room = await prisma.rooms.update({
              where: { id: data.member.roomsId },
              data: { members: { disconnect: { id: data.member.id } } },
            });
            await prisma.members.delete({
              where: { id: data.member.id },
            });
            return room;
          });
          this.server.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_KICK}`,
            { result, member: data.member },
          );
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            result,
          );
        }
        // set owner :
        if (data.updateType === updatememberEnum.SETOWNER) {
          const type: UserType =
            __member.type === UserType.OWNER ? UserType.USER : UserType.OWNER;
          const member = await this.prisma.members.update({
            where: { id: data.member.id },
            data: { type: type },
          });
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            member,
          );
        }

        // create room :
      } catch (error) {
        console.log('Chat-updatemember> error- +>', error);
      }
      const ResponseEventData: responseEvent = {
        status: responseEventStatusEnum.SUCCESS,
        message: responseEventMessageEnum.SUCCESS,
        data: __member,
      };
      this.server.emit(
        `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
        ResponseEventData,
      );
    } catch (error) {
      console.log('error f server ...');
    }
  }

  @SubscribeMessage(`${process.env.SOCKET_EVENT_JOIN_MEMBER}`)
  async joinmember(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      userid: string;
      roomid: string;
    },
  ) {
    console.log('SOCKET_EVENT_JOIN_MEMBER:', data);

    const ResponseEventData: responseEvent = {
      status: responseEventStatusEnum.SUCCESS,
      message: responseEventMessageEnum.WELLCOME,
      data: null,
    };
    const room = await this.roomservice.findOne({ id: data.roomid });
    try {
      // check if member is already in room database :
      const existMember = await this.memberService.findOne({
        userId: data.userid,
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
          data.userid,
          member.id,
          room.id,
        );
        console.log('roomJoined :', roomJoined);
        ResponseEventData.status = responseEventStatusEnum.SUCCESS;
        ResponseEventData.message = responseEventMessageEnum.WELLCOMEBACK;
        ResponseEventData.data = roomJoined;
        // send response to client :
        // client.emit('sendNotification', { userId: data.userid, room: room });

        client.emit(
          `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
          ResponseEventData,
        );
        return;
      }
      // create member :
      const member = await this.memberService.create({
        user: data.userid,
        roomId: data.roomid,
        type: UserType.USER,
      });
      // add member to room :
      const roomJoined = await this.roomservice.joinToRoom(
        data.userid,
        member.id,
        room.id,
      );
      ResponseEventData.status = responseEventStatusEnum.SUCCESS;
      ResponseEventData.message = responseEventMessageEnum.WELLCOME;
      ResponseEventData.data = roomJoined;
      // send response to client :
      // client.emit('sendNotification', { userId: data.userid, room: room });

      client.emit(
        `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
        ResponseEventData,
      );
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
      return;
    }
    // send event to all client  that member is join to room :
    // client.emit('sendNotification', { userId: data.userid, room: room });
    this.server.emit(
      `${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
      ResponseEventData,
    );
  }
  @SubscribeMessage(`${process.env.SOCKET_EVENT_CHAT_CREATE}`)
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      name: string;
      type: RoomType;
      friends: UserType[];
      channeLpassword?: string;
    },
  ) {
    const ResponseEventData: responseEvent = {
      status: responseEventStatusEnum.SUCCESS,
      message: responseEventMessageEnum.DELETESUCCESS,
      data: null,
    };
    try {
      const { name, type, friends, channeLpassword } = data;
      const LogedUser = await this.usersService.getUserInClientSocket(client);
      if (!LogedUser) throw new Error();
      // check if the room name exist :
      const existChanneLname = await this.roomservice.findOneByName({ name });
      if (existChanneLname) {
        ResponseEventData.status = responseEventStatusEnum.ERROR;
        ResponseEventData.message = responseEventMessageEnum.CHANNELEXIST;
        ResponseEventData.data = null;
        // send response to the client that the name exist
        client.emit(
          `${process.env.SOCKET_EVENT_RESPONSE_CHAT_CREATE}`,
          ResponseEventData,
        );
        this.server.emit(
          `${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
          null,
        );
      } else {
        const newRoom = await this.roomservice.create({
          name,
          type,
          friends,
          channeLpassword,
        });
        if (!newRoom) throw new Error();
        console.log('newRoom :', newRoom);
        ResponseEventData.status = responseEventStatusEnum.SUCCESS;
        ResponseEventData.message = responseEventMessageEnum.CHANNELCREATED;
        ResponseEventData.data = newRoom;
        // send response to the client that the name exist
        client.emit(
          `${process.env.SOCKET_EVENT_RESPONSE_CHAT_CREATE}`,
          ResponseEventData,
        );
      }
      // send message that room is created :
      this.server.emit(
        `${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
        ResponseEventData,
      );
    } catch (error) {
      ResponseEventData.status = responseEventStatusEnum.ERROR;
      ResponseEventData.message = responseEventMessageEnum.CHANNELEXIST;
      ResponseEventData.data = null;
      this.server.emit(
        `${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
        ResponseEventData,
      );
    }
  }

  @SubscribeMessage(`${process.env.SOCKET_EVENT_CHAT_DELETE}`)
  async deleteRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      userId: string;
      roomId: string;
    },
  ) {
    const ResponseEventData: responseEvent = {
      status: responseEventStatusEnum.SUCCESS,
      message: responseEventMessageEnum.DELETESUCCESS,
      data: null,
    };
    console.log('SOCKET_EVENT_CHAT_DELETE :', data);
    try {
      // check if member is already in room database and is owner :
      const User = await this.usersService.findOne({ id: data.userId });
      // get room from database :
      const room = await this.roomservice.findOne({ id: data.roomId });
      // get member from database :
      const member = await this.memberService.findOne({
        userId: User.id,
        roomId: room.id,
      });
      // chck if no User or room or member or this member is not Owner
      if (!User || !room || !member || member.type !== UserTypeEnum.OWNER)
        throw new NotFoundException();
      // delete room :
      const deleteRoom = await this.roomservice.remove(room.id);
      ResponseEventData.data = deleteRoom;
      client.emit(
        `${process.env.SOCKET_EVENT_RESPONSE_CHAT_DELETE}`,
        ResponseEventData,
      );
    } catch (error) {
      ResponseEventData.data = null;
      ResponseEventData.status = responseEventStatusEnum.ERROR;
      ResponseEventData.message = responseEventMessageEnum.CANTDELETE;
      client.emit(
        `${process.env.SOCKET_EVENT_RESPONSE_CHAT_DELETE}`,
        ResponseEventData,
      );
    }
    this.server.emit(
      `${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
      ResponseEventData,
    );
    // send event to all client  that owner delete room :
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
    @MessageBody() data: Rooms,
  ) {
    try {
      // get room from database :
      const room = await this.roomservice.findOne({ id: data.id });
      // get user from client :
      const LogedUser = await this.usersService.getUserInClientSocket(client);
      if (!LogedUser) return;
      console.log(
        'Chat-> joinRoom +> user :%s has join to room :%s with socket %s',
        LogedUser.login,
        room.name,
        client.id,
      );
      // check if member is already in room database :
      const _isMemberInRoom = await this.roomservice.isMemberInRoom(
        data.id,
        LogedUser.id,
      );
      // console.log('Chat-> responseMemberData- +>', responseMemberData);
      if (_isMemberInRoom !== null) {
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

  // Leave ChanneL :
  @SubscribeMessage(`${process.env.SOCKET_EVENT_CHAT_MEMBER_LEAVE}`)
  async LeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const ResponseEventData: responseEvent = {
      status: responseEventStatusEnum.SUCCESS,
      message: responseEventMessageEnum.SUCCESS,
      data: null,
    };
    try {
      // get User data from the token :
      const LogedUser = await this.usersService.getUserInClientSocket(client);
      // get room data :
      const room = await this.roomservice.findOne({ id: data.roomId });
      // get member data :
      const member = await this.memberService.findOne({
        userId: LogedUser.id,
        roomId: room.id,
      });

      if (!LogedUser || !room || !member) throw new Error();
      // disconnect the member from the room :
      ResponseEventData.data = await this.prisma.$transaction(
        async (prisma) => {
          // disconnect member from room :
          const channel = await this.prisma.rooms.update({
            where: { id: room.id },
            data: {
              members: {
                disconnect: {
                  id: member.id,
                },
              },
            },
            include: {
              members: true,
            },
          });
          // disconnect room from User :
          await prisma.user.update({
            where: { id: LogedUser.id },
            data: {
              Rooms: {
                disconnect: {
                  id: channel.id,
                },
              },
            },
            include: { Rooms: true },
          });
          // console.log('SOCKET_EVENT_CHAT_MEMBER_LEAVE :', _User);
          return channel;
        },
      );
      ResponseEventData.status = responseEventStatusEnum.SUCCESS;
      ResponseEventData.message = responseEventMessageEnum.ERROR;
      // client.leave(data.roomId);
    } catch (error) {
      ResponseEventData.data = null;
      ResponseEventData.status = responseEventStatusEnum.ERROR;
      ResponseEventData.message = responseEventMessageEnum.ERROR;
    }
    client.emit(
      `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_LEAVE}`,
      ResponseEventData,
    );
    this.server.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, null);
  }

  @SubscribeMessage('sendMessage')
  async handleEvent(@MessageBody() data: any) {
    let messages: any;
    try {
      console.log('sendMessage :', data);
      messages = await this.messageservice.create({
        roomId: data.roomsId,
        content: data.content,
        userId: data.senderId,
      });
      const room = await this.roomservice.findOne({ id: data.roomsId });
      console.log('to channeL :%s +>', room.name, messages);
      this.server.to(data.roomsId).emit('message', messages);
      // this.server.emit('message', messages);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log('Chat-sendMessage> error- +>', error);
      }
    }
  }

  @SubscribeMessage(`${process.env.SOCKET_EVENT_CHAT_UPDATE}`)
  async updateChanneL(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UpdateChanneLSendData,
  ) {
    const ResponseEventData: responseEvent = {
      status: responseEventStatusEnum.SUCCESS,
      message: responseEventMessageEnum.SUCCESS,
      data: null,
    };
    const room = await this.roomservice.findOne({ id: data.room.id });
    try {
      console.log('Chat-> updateChanneL +> data :', data);
      const LogedUser = await this.usersService.getUserInClientSocket(client);
      if (!LogedUser) return;
      const responseMemberData = await this.roomservice.isMemberInRoom(
        room.id,
        LogedUser.id,
      );
      if (responseMemberData.type === UserType.OWNER) {
        // console.log('Chat-> responseMemberData- +>', responseMemberData);
        // check type of update :
        // change protacted password :
        if (data.Updatetype === UpdateChanneLSendEnum.CHANGEPROTACTEDPASSWORD) {
          console.log('Update protacted password');
          const dataRoom = {
            name: room.name,
            type: room.type,
            accesspassword: room.accesspassword,
            password: data.password,
          };
          const updateRoom = await this.prisma.rooms.update({
            where: { id: room.id },
            data: {
              ...dataRoom,
            },
          });
          console.log('Chat-> updateChanneL +> updateRoom :', updateRoom);
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_CHANGE_PROTACTED_PASSWORD}`,
            updateRoom,
          );
        }
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
          ResponseEventData.data = updateRoom;
          ResponseEventData.status = responseEventStatusEnum.SUCCESS;
          ResponseEventData.message = responseEventMessageEnum.SUCCESS;
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_CHANGE_TYPE}`,
            ResponseEventData,
          );
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
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_SET_ACCESS_PASSWORD}`,
            updateRoom,
          );
        }
        // remove access password :
        if (data.Updatetype === UpdateChanneLSendEnum.REMOVEACCESSEPASSWORD) {
          const dataRoom = {
            accesspassword: '',
            hasAccess: false,
          };
          const updateRoom = await this.prisma.rooms.update({
            where: { id: room.id },
            data: {
              ...dataRoom,
            },
          });
          console.log('Chat-> updateChanneL +> updateRoom :', updateRoom);
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_REMOVE_ACCESS_PASSWORD}`,
            updateRoom,
          );
        }
      }
    } catch (error) {
      console.log('Chat-updateChanneL> error- +>');
      ResponseEventData.data = null;
      ResponseEventData.status = responseEventStatusEnum.ERROR;
      ResponseEventData.message = responseEventMessageEnum.ERROR;

      this.server.emit(
        `${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
        ResponseEventData,
      );
      return;
    }
    ResponseEventData.data = room;
    ResponseEventData.status = responseEventStatusEnum.SUCCESS;
    ResponseEventData.message = responseEventMessageEnum.SUCCESS;

    this.server.emit(
      `${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
      ResponseEventData,
    );
  }
  @SubscribeMessage('sendNotification')
  async sendNotification(
    @MessageBody() data: { userId: string; senderId: string; mode: string },
  ) {
    try {
      console.log('Chat-> sendNotification +> data :', data);
      const snderUser: User | null = await this.usersService.findOne({
        id: data.senderId,
      });
      if (!snderUser) return;
      // git owner of room :
      const UserTOSendTo: User | null = await this.usersService.findOne({
        id: data.userId,
      });
      console.log('Chat-> sendNotification +> sendedUser :', UserTOSendTo);

      if (UserTOSendTo) {
        const ListSocket = clientOnLigne.get(UserTOSendTo.id);
        console.log('Chat-> sendNotification +> ListSocket :', ListSocket);

        if (ListSocket) {
          ListSocket.forEach((socket) => {
            socket.emit('notificationEvent', {
              message: `wants to play game with you`,
              sender: snderUser,
              mode: data.mode,
            });
          });
        }
      }
    } catch (error) {
      console.log('Chat-sendNotification> error- +>', error);
    }
  }

  // @SubscribeMessage('askToPlayGameWith')
  // async askToPlayGameWith(@MessageBody() data: {}) {}
}
