import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  Members,
  Messages,
  RoomType,
  Rooms,
  User,
  UserType,
} from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { MembersService } from 'src/members/members.service';
import { MessagesService } from 'src/messages/messages.service';
import { PrismaService } from 'src/prisma.service';
import { clientOnLigne } from 'src/users/user.gateway';
import { UserService } from 'src/users/user.service';
import { UserTypeEnum, userType } from 'src/users/user.type';
import { RoomsService } from './rooms.service';
import { JoinStatusEnum } from './types/room.joinStatus';
import {
  UpdateChanneLSendData,
  UpdateChanneLSendEnum,
} from './types/upatecahnnel';
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

export enum responseEventTypeEnum {
  LEAVEROOM = 'LEAVEROOM',
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
  message?: responseEventMessageEnum;
  type?: responseEventTypeEnum;
  data: Rooms | Members | User | null;
};
@Injectable()
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
    const User = await this.usersService.getUserInClientSocket(socket);
    if (User) {
      console.log('Chat-> %s connected with socketId :', User.login, socket.id);
      this.server.emit('ref', { socketId: socket.id });
    }
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
        }
        // ban member :
        if (data.updateType === updatememberEnum.BANMEMBER) {
          const __isBan: boolean = __member.isban === true ? false : true;
          const member = await this.prisma.members.update({
            where: { id: data.member.id },
            data: { isban: __isBan },
          });
          // client.emit('updatememberResponseEvent', member);
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
          if (member.ismute) {
            setTimeout(() => {
              const member = (async () => {
                return await this.prisma.members.update({
                  where: { id: data.member.id },
                  data: { ismute: false },
                });
              })();
              this.server.emit(
                `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
                { OK: true },
              );
            }, 60000);
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
            { OK: true },
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
        }

        this.server.emit(
          `${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
          { OK: true },
        );
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
        { OK: false },
      );
    } catch (error) {
      console.log('error f server ...');
    }
  }

  @SubscribeMessage(`${process.env.SOCKET_EVENT_ADD_MEMBER}`)
  async Addmember(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      userid: string;
      roomid: string;
    },
  ) {
    // check if room exist :
    const room = await this.roomservice.findOne({ id: data.roomid });
    // check if user exist :
    const user = await this.usersService.findOne({ id: data.userid });
    if (!room || !user) {
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_ADD_MEMBER}`, {
        Ok: false,
        message: 'room or user not exist',
      });
      return;
    }
    // create member :
    const memberId = await this.memberService.create({
      type: UserType.USER,
      user: data.userid,
      roomId: data.roomid,
    });
    if (!memberId) {
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_ADD_MEMBER}`, {
        Ok: false,
        message: `you cant Add ${user.login} to this room`,
      });
      return;
    }

    // join to room :
    const JoinRoom = await this.roomservice.joinToRoom(
      data.userid,
      memberId.id,
      data.roomid,
    );

    if (!JoinRoom) {
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_ADD_MEMBER}`, {
        Ok: false,
        message: `you are add ${user.login} to this room`,
      });
      return;
    }
    // send response to client :
    client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_ADD_MEMBER}`, {
      Ok: true,
      message: 'you are join to this room',
    });
    // send event to all client that user join to room :
    this.server.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, {
      Ok: true,
    });
  }

  @SubscribeMessage(`${process.env.SOCKET_EVENT_JOIN_MEMBER}`)
  async joinmember(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      password?: string;
      userid: string;
      roomid: string;
    },
  ) {
    // check if room exist :
    const room = await this.roomservice.findOne({ id: data.roomid });
    // check if user exist :
    const user = await this.usersService.findOne({ id: data.userid });
    if (!room || !user) {
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_JOIN_MEMBER}`, {
        Ok: false,
        message: 'room or user not exist',
      });
      return;
    }
    // check if room is protected :
    if (room.type === RoomType.PROTECTED) {
      // check if password is empty :
      const isPasswordEmpty = !data.password.trim();
      if (isPasswordEmpty) {
        client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_JOIN_MEMBER}`, {
          Ok: false,
          message: 'password is empty',
        });
        return;
      }
      // check if password is correct :
      const isPasswordCorrect = await this.usersService.comparePasswords(
        data.password,
        room.password,
      );
      if (!isPasswordCorrect) {
        client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_JOIN_MEMBER}`, {
          Ok: false,
          message: 'password is not correct',
        });
        return;
      }
    }
    // create member :
    const memberId = await this.memberService.create({
      type: UserType.USER,
      user: data.userid,
      roomId: data.roomid,
    });
    if (!memberId) {
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_JOIN_MEMBER}`, {
        Ok: false,
        message: 'you cant join to this room',
      });
      return;
    }

    // join to room :
    const JoinRoom = await this.roomservice.joinToRoom(
      data.userid,
      memberId.id,
      data.roomid,
    );

    if (!JoinRoom) {
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_JOIN_MEMBER}`, {
        Ok: false,
        message: 'you cant join to this room',
      });
      return;
    }
    // send response to client :
    client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_JOIN_MEMBER}`, {
      Ok: true,
      message: 'you are join to this room',
    });
    // send event to all client that user join to room :
    this.server.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, {
      Ok: true,
    });
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
    try {
      const { name, type, friends, channeLpassword } = data;
      const LogedUser = await this.usersService.getUserInClientSocket(client);
      if (!LogedUser) throw new Error();
      // check if name is empty :
      const isNameEmpty = !name.trim();
      if (isNameEmpty) throw new Error('name is empty');
      // check if the room name exist :
      const existChanneLname = await this.roomservice.findOneByName({ name });
      if (existChanneLname) {
        // send response to the client that the name exist
        client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_CREATE}`, {
          OK: false,
          message: 'the channel name exist',
        });
      } else {
        // create room :
        // hash password :
        const hashPassword = await this.usersService.hashPassword(
          channeLpassword,
        );
        const newRoom = await this.roomservice.create({
          name,
          type,
          friends,
          channeLpassword: hashPassword,
        });
        if (!newRoom) throw new Error();

        // send response to the client that the name exist
        client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_CREATE}`, {
          OK: true,
          message: 'Channel created success',
          data: newRoom,
        });
      }
      // send message that room is created :
      this.server.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, {
        OK: true,
      });
    } catch (error) {
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_CREATE}`, {
        OK: false,
        message: error.message,
        data: null,
      });
      this.server.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, {
        OK: false,
      });
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
      if (!member && member.type !== UserTypeEnum.OWNER)
        throw new UnauthorizedException();

      // delete room :
      const deleteRoom = await this.roomservice.remove(room.id);
      ResponseEventData.data = deleteRoom;
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_DELETE}`, {
        Ok: true,
      });
    } catch (error) {
      ResponseEventData.data = null;
      ResponseEventData.status = responseEventStatusEnum.ERROR;
      ResponseEventData.message = responseEventMessageEnum.ERROR;
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_DELETE}`, {
        Ok: false,
      });
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
    if (_isMemberInRoom !== null && !client.rooms.has(data.roomId)) {
      // await client.join(data.roomId);
      // send response to client :
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
      // check if member is already in room database :
      const _isMemberInRoom = await this.roomservice.isMemberInRoom(
        data.id,
        LogedUser.id,
      );
      // console.log('Chat-> responseMemberData- +>', responseMemberData);
      if (_isMemberInRoom !== null) {
        await client.join(room.id);
        // send response to client :
        client.emit('accessToroomResponse', { channeL: room, LogedUser });
      } else throw new Error();
    } catch (error) {
      client.emit('accessToroomResponse', null);
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
      type: responseEventTypeEnum.LEAVEROOM,
      data: null,
    };
    try {
      // get User data from the token :
      const LogedUser = await this.usersService.getUserInClientSocket(client);
      // get room data :
      const room = await this.roomservice.findOne({ id: data.roomId });
      // get member data :
      const LeavedChanneL = await this.roomservice.LeaveChanneL({
        userId: LogedUser.id,
        roomId: room.id,
      });

      if (!LeavedChanneL) throw new Error();
      // send response to client :
      ResponseEventData.status = responseEventStatusEnum.SUCCESS;
      ResponseEventData.data = LeavedChanneL;
      // leave room socket :
      client.leave(data.roomId);
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_LEAVE}`, {
        Ok: true,
      });
    } catch (error) {
      client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_MEMBER_LEAVE}`, {
        Ok: false,
      });
    }
    this.server.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, {
      Ok: false,
    });
  }

  @SubscribeMessage('sendMessage')
  async handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const room = await this.roomservice.findOne({ id: data.roomsId });
      const User = await this.usersService.getUserInClientSocket(client);
      if (!User || !room) return;
      // check if member is already in room database :
      const _isMemberInRoom = await this.roomservice.isMemberInRoom(
        room.id,
        User.id,
      );

      // chack if user in room :
      // const isClientInRoom = client.rooms.has(data.roomId) || false;
      // if (!isClientInRoom && _isMemberInRoom) {
      //   await client.join(data.id);
      // }
      // check if member is muted or ban :
      if (_isMemberInRoom.ismute) {
        client.emit('sendMessageResponse', {
          OK: false,
          message: 'you are muted',
        });
        return;
      }
      if (_isMemberInRoom.isban) {
        client.emit('sendMessageResponse', {
          OK: false,
          message: 'you are ban',
        });
        return;
      }

      // console.log('Chat-> responseMemberData- +>', responseMemberData);
      const messages: Messages = await this.messageservice.create({
        roomId: room.id,
        content: data.content,
        userId: User.id,
      });
      // send message to all client in the room :
      this.server.to(room.id).emit('newmessage', messages);
      // this.server.emit('message', messages);
    } catch (error) {
      if (error) {
        console.log('Chat-sendMessage> error- +>', error);
      }
    }
  }

  @SubscribeMessage(`leaveRoomSocket`)
  async leaveRoomSocket(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const room = await this.roomservice.findOne({ id: data.roomId });
      const User = await this.usersService.getUserInClientSocket(client);
      if (!User || !room) return;
      // check if member is already in room database :
      const _isMemberInRoom = await this.roomservice.isMemberInRoom(
        room.id,
        User.id,
      );
      if (_isMemberInRoom) {
        await client.leave(data.roomId);
        // send response to client :
        client.emit('leaveRoomSocketResponse', {
          OK: true,
          message: 'you are leave the room',
        });
      } else throw new Error();
    } catch (error) {
      client.emit('leaveRoomSocketResponse', {
        OK: false,
        message: 'you are not member or not in the socket channel yet',
      });
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
          /*
            Update protacted password
            Chat-> updateChanneL +> updateRoom : {
              Updatetype: 'CHANGEPROTACTEDPASSWORD',
              room: {
                id: 'b6b80bb0-363b-4d4e-b2ef-56da0bc44213',
                name: 'memores',
                type: 'PROTECTED',
                viewedmessage: 0,
                password: '1111',
                hasAccess: false,
                accesspassword: '',
                created_at: '2023-08-26T09:21:42.629Z',
                updated_at: '2023-08-26T09:23:09.219Z',
                slug: 'memores',
                members: [ [Object] ]
              },
              newpassword: '4',
              password: '3',
              confirmpassword: '3'
            }
          **/
          let message = 'password changed success';
          try {
            // chack if password is empty :
            const isPasswordEmpty = !data.newpassword.trim();
            if (isPasswordEmpty) {
              message = 'password is empty';
              throw new Error();
            }
            // check if password is correct:
            const isPasswordCorrect = await this.usersService.comparePasswords(
              data.password,
              room.password,
            );
            if (!isPasswordCorrect) {
              message = 'password is not correct';
              throw new Error();
            }
            // check if new password and confirm password is the same :
            if (data.newpassword !== data.confirmpassword) {
              message = 'new password and confirm password is not the same';
              throw new Error();
            }
            // check if new password is the same as old password :
            if (data.newpassword === room.password) {
              message = 'new password is the same as old password';
              throw new Error();
            }
            // update password :
            // hash new password :
            const hashPassword = await this.usersService.hashPassword(
              data.newpassword,
            );
            const dataRoom = {
              name: room.name,
              type: room.type,
              accesspassword: room.accesspassword,
              password: hashPassword,
            };
            await this.prisma.rooms.update({
              where: { id: room.id },
              data: {
                ...dataRoom,
              },
            });
            client.emit(
              `${process.env.SOCKET_EVENT_RESPONSE_CHAT_CHANGE_PROTACTED_PASSWORD}`,
              { OK: true, message },
            );
            return;
          } catch (error) {
            client.emit(
              `${process.env.SOCKET_EVENT_RESPONSE_CHAT_CHANGE_PROTACTED_PASSWORD}`,
              { OK: false, message },
            );
            return;
          }

          // const dataRoom = {
          //   name: room.name,
          //   type: room.type,
          //   accesspassword: room.accesspassword,
          //   password: data.password,
          // };
          // const updateRoom = await this.prisma.rooms.update({
          //   where: { id: room.id },
          //   data: {
          //     ...dataRoom,
          //   },
          // });
          // console.log('Chat-> updateChanneL +> updateRoom :', data);
          // client.emit(
          //   `${process.env.SOCKET_EVENT_RESPONSE_CHAT_CHANGE_PROTACTED_PASSWORD}`,
          //   { OK: true },
          // );
        }
        // change type of room :
        if (data.Updatetype === UpdateChanneLSendEnum.CHANGETYPE) {
          /*
          
            CHANGETYPE PasswordCorrect : {
            roomtype: 'PROTECTED',
            room: {
              id: 'b6b80bb0-363b-4d4e-b2ef-56da0bc44213',
              name: 'memores',
              type: 'PUBLIC',
              viewedmessage: 0,
              password: null,
              hasAccess: false,
              accesspassword: '',
              created_at: '2023-08-26T09:21:42.629Z',
              updated_at: '2023-08-26T12:33:15.447Z',
              slug: 'memores',
              members: [ [Object] ]
            },
            Updatetype: 'CHANGETYPE',
            password: '11',
            confirmpassword: '11',
            accesspassword: ''
          }

          **/

          let message = 'type changed success';
          let dataRoom: any = {};
          // check if channel is protected :
          if (data.roomtype === RoomType.PROTECTED) {
            const isPasswordEmpty = !data.password.trim();
            if (isPasswordEmpty) {
              message = 'password is empty';
              throw new Error();
            }
            if (data.password !== data.confirmpassword) {
              message = 'password is not match confirm password';
              throw new Error();
            }

            const hashPassword = await this.usersService.hashPassword(
              data.password,
            );
            dataRoom = {
              name: room.name,
              type: data.roomtype,
              accesspassword: room.accesspassword,
              password: hashPassword,
            };
          }
          // check if password is match  confirm password :
          else {
            dataRoom = {
              name: room.name,
              type: data.roomtype,
              accesspassword: room.accesspassword,
              password: room.password,
            };
          }
          await this.prisma.rooms.update({
            where: { id: room.id },
            data: {
              ...dataRoom,
            },
          });
          client.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_CHANGE_TYPE}`, {
            OK: true,
            message,
          });
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
          client.emit(
            `${process.env.SOCKET_EVENT_RESPONSE_CHAT_REMOVE_ACCESS_PASSWORD}`,
            updateRoom,
          );
        }
        this.server.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, {
          OK: true,
        });
      } else throw new UnauthorizedException();
    } catch (error) {
      console.log('Chat-updateChanneL> error- +>');
      this.server.emit(`${process.env.SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, {
        OK: false,
      });
      return;
    }
  }
  @SubscribeMessage('sendGameNotification')
  async sendGameNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; senderId: string; mode: string },
  ) {
    try {
      const snderUser: User | null = await this.usersService.findOne({
        id: data.senderId,
      });
      if (!snderUser) return;
      // git owner of room :
      const UserTOSendTo: User | null = await this.usersService.findOne({
        id: data.userId,
      });

      if (UserTOSendTo) {
        const ListSocket = clientOnLigne.get(UserTOSendTo.id);

        if (ListSocket) {
          ListSocket.forEach((socket) => {
            socket.emit('GameNotificationResponse', {
              message: `wants to play ${data.mode} mode game with you`,
              sender: snderUser,
              senderSocketId: client.id,
              mode: data.mode,
            });
          });
        }
      }
    } catch (error) {
      console.log('Chat-sendGameNotification> error- +>', error);
    }
  }

  @SubscribeMessage('GameResponseToChat')
  async GameResponseToChat(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    Resp: { response: string; sendTo: userType; mode: string },
  ) {
    const User = await this.usersService.getUserInClientSocket(client);
    const sendToUser = await this.usersService.findOne({
      id: Resp.sendTo.id,
    });
    if (!User || !sendToUser) return;
    this.server.emit('GameResponseToChatToUser', {
      Response: Resp.response === 'Accept' ? true : false,
      User: User,
      sender: sendToUser,
      mode: Resp.mode,
    });
  }

  // @SubscribeMessage('askToPlayGameWith')
  // async askToPlayGameWith(@MessageBody() data: {}) {}
}
