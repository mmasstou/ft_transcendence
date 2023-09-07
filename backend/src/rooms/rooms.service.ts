import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ChanneLNotifications,
  Members,
  Messages,
  RoomType,
  Rooms,
  User,
  UserType,
} from '@prisma/client';
import { MembersService } from 'src/members/members.service';
import { MessagesService } from 'src/messages/messages.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';
import { UserTypeEnum } from 'src/users/user.type';

@Injectable()
export class RoomsService {
  constructor(
    private prisma: PrismaService,
    private membersservice: MembersService,
    private messageservice: MessagesService,
    private readonly userService: UserService,
  ) {}

  async HasPermissionToAccess(params: { roomId: string; userId: string }) {
    try {
      const User = await this.userService.findOne({ id: params.userId });
      const Room = await this.prisma.rooms.findUnique({
        where: { id: params.roomId },
        include: { members: true },
      });
      if (!User || !Room) throw new Error();

      const _member = await this.membersservice.findOne({
        userId: User.id,
        roomId: Room.id,
      });
      if (!_member) throw new Error();
      for (let index = 0; index < Room.members.length; index++) {
        const element = Room.members[index];
        if (element.userId === User.id) {
          return true;
        }
      }
      throw new NotFoundException();
    } catch (error) {
      return false;
    }
  }
  // check if member is in room
  async isMemberInRoom(roomId: string, userId: string) {
    const room = await this.prisma.rooms.findUnique({
      where: { id: roomId },
      include: { members: true },
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }
    const member = room.members.find((member) => member.userId === userId);
    if (!member) {
      throw new NotFoundException(
        `User with ID ${userId} is not a member of room with ID ${roomId}`,
      );
    }
    return member;
  }

  async findOne(params: { id: string }): Promise<Rooms> {
    const { id } = params;
    try {
      const room = await this.prisma.rooms.findUnique({
        where: { id },
        include: { members: true },
      });
      if (!room) throw new Error('');
      return room;
    } catch (error) {
      console.log('channeL with id %s not found', id);
      return null;
    }
  }

  async findOneBySLug(params: { slug: string }) {
    const { slug } = params;
    try {
      const room = await this.prisma.rooms.findUnique({
        where: { slug },
        include: { members: true },
      });
      if (!room) throw new Error('');
      return room;
    } catch (error) {
      console.log('channeL with slug %s not found', slug);
      return new NotFoundException();
    }
  }

  async findOneByName(params: { name: string }): Promise<Rooms | null> {
    try {
      const { name } = params;
      const room = await this.prisma.rooms.findUnique({
        where: { name },
      });
      if (!room) throw new NotFoundException();
      return room;
    } catch (error) {
      console.log('Rooms-findOneByName> error- +>', error.message);
      return null;
    }
  }

  async findNotifications(params: {
    login: string;
    channeLId: string;
  }): Promise<ChanneLNotifications[]> {
    try {
      const { login, channeLId } = params;
      const User = await this.userService.findOneLogin({ login });
      const ChanneL = await this.prisma.rooms.findUnique({
        where: {
          id: channeLId,
        },
      });
      if (!User || !ChanneL) return;
      const notifications = await this.prisma.channeLNotifications.findMany({
        where: {
          channelId: ChanneL.id,
        },
      });
      if (!notifications) throw new Error();
      return notifications;
    } catch (error) {
      console.log('Rooms-findOne> error- +>', error.message);
      throw new NotFoundException();
    }
  }

  async findOwners(params: { channeLId: string }): Promise<User[]> {
    try {
      const { channeLId } = params;
      const room = await this.prisma.rooms.findUnique({
        where: { id: channeLId },
        include: {
          members: true,
        },
      });
      // get Owners member :
      const _members: User[] = [];

      for (let index = 0; index < room.members.length; index++) {
        const member = room.members[index];
        if (member.type === UserTypeEnum.OWNER) {
          const UserforMember = await this.userService.findOne({
            id: member.userId,
          });
          UserforMember && _members.push(UserforMember);
        }
      }
      if (!_members) throw new Error('');
      return _members;
    } catch (error) {
      console.log('Rooms-findOne> error- +>', error.message);
      throw new NotFoundException();
    }
  }

  async findAll(): Promise<Rooms[]> {
    return this.prisma.rooms.findMany({
      include: {
        members: true,
        messages: true,
      },
    });
  }

  async findUserRooms(userId: string) {
    const __User = await this.prisma.user.findUnique({
      where: { login: userId },
    });
    if (!__User)
      throw new NotFoundException(`User with ID ${userId} not found`);

    const rooms = await this.prisma.rooms.findMany({
      where: {
        members: {
          some: {
            userId: __User.id,
          },
        },
      },
      include: {
        members: true,
        messages: true,
      },
    });

    return rooms;
  }

  // this is the function that create room and add members to it
  async create(_data: {
    name: string;
    type: RoomType;
    friends: UserType[];
    channeLpassword?: string;
  }) {
    try {
      // console.log('++create+data+>', _data);
      // console.log('++create+userId+>', userId);
      return await this.prisma.$transaction(async (prisma) => {
        // console.log('++data : ', _data);
        const slug = this.createSlug(_data.name);
        const room = await prisma.rooms.create({
          data: {
            name: _data.name,
            type: _data.type,
            slug,
            password: _data.channeLpassword,
            members: {
              create: _data.friends.map((friend: any) => ({
                user: {
                  connect: { id: friend.id },
                },
                type: friend.role,
              })),
            },
          },
          include: {
            members: true,
            ChanneLNotifications: true,
          },
        });
        // console.log('***** +> _data.friends.length :', _data.friends.length);
        for (let index = 0; index < _data.friends.length; index++) {
          const element: any = _data.friends[index];
          // console.log('++_data.friends[index]+>', element);
          await prisma.user.update({
            where: { id: element.id },
            data: {
              Rooms: {
                connect: { id: room.id },
              },
            },
          });
        }
        return room;
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async update(params: {
    id: string;
    data: { name?: string };
  }): Promise<Rooms> {
    const { id, data } = params;
    // console.log('++update++>', id);

    return await this.prisma.rooms.update({
      data,
      where: { id },
    });
  }

  async remove(id: string): Promise<Rooms | null> {
    // console.log('++remove++>', id);

    try {
      const room = await this.prisma.rooms.findUnique({
        where: { id },
        include: { members: true },
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }
      const result = await this.prisma.$transaction(async (prisma) => {
        // Delete all associated Members entities first
        await prisma.members.deleteMany({
          where: { roomsId: id },
        });
        // console.log('mmrs :', mmrs);

        // Delete all associated Members entities first
        await prisma.messages.deleteMany({
          where: { roomsId: id },
        });
        // console.log('rms :', rms);

        return await prisma.rooms.delete({
          where: { id },
        });
      });
      return result;
    } catch (error) {
      console.log('+++> error :', error);
      return null;
    }
  }

  async AddMessage(dep: {
    roomId: string;
    content: string;
    userId: string;
  }): Promise<Rooms> {
    try {
      const User = await this.prisma.user.findUnique({
        where: { id: dep.userId },
      });
      const roomIId = await this.prisma.rooms.findUnique({
        where: { id: dep.roomId },
      });
      // console.log('User :', User);
      // console.log('roomIId :', roomIId);

      const message = await this.prisma.messages.create({
        data: {
          content: dep.content,
          sender: {
            connect: { id: User.id },
          },
          roomId: {
            connect: { id: roomIId.id },
          },
        },
      });

      // console.log('message :', message);
      const room = this.prisma.rooms.update({
        where: { id: dep.roomId },
        data: {
          messages: {
            connect: { id: message.id },
          },
          members: {
            connect: { id: User.id },
          },
        },
        include: {
          messages: true,
        },
      });
      return room;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: "CAN'T CREATE THIS MESSAGE",
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
  }

  async JoinUser(params: { userId: string; roomId: string }) {
    try {
      // const User = await this.prisma.user.findUnique({
      //   where: { id: params.userId },
      // });
      const Member = await this.prisma.members.create({
        data: {
          user: {
            connect: { id: params.userId },
          },
          RoomId: {
            connect: { id: params.roomId },
          },
          type: 'USER',
        },
      });
      return await this.prisma.rooms.update({
        data: {
          members: {
            connect: { id: Member.id },
          },
        },
        where: {
          id: params.roomId,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "CAN'T EDIT THIS MESSAGE",
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async UpdateMessage(params: {
    messageId: string;
    content: string;
  }): Promise<Messages> {
    try {
      const message = await this.prisma.messages.update({
        where: {
          id: params.messageId,
        },
        data: { content: params.content },
      });
      return message;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "CAN'T EDIT THIS MESSAGE",
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async DeleteMessage(params: { messageId: string }): Promise<Messages> {
    try {
      const message = await this.prisma.messages.delete({
        where: { id: params.messageId },
      });
      return message;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'NO MESSAGE WIDTH THIS ID',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  async getaLLmessages(messageId: string) {
    try {
      const message = await this.prisma.rooms.findUnique({
        where: { id: messageId },
        select: {
          messages: true,
        },
      });
      // console.log('message :', message);
      return message;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'NO MESSAGE WIDTH THIS ID',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  async addMemberToRoom(
    userId: string,
    roomId: string,
    userType: UserType = 'USER',
  ) {
    const newMember = await this.prisma.members.create({
      data: {
        user: { connect: { id: userId } },
        RoomId: { connect: { id: roomId } },
        type: userType,
      },
    });

    return newMember;
  }

  async findPublicAndProtected(login: string) {
    // git user :
    const User = await this.userService.findOneLogin({ login });
    // check if user is member
    const rooms = await this.prisma.rooms.findMany({
      where: {
        type: {
          in: ['PUBLIC', 'PROTECTED'],
        },
      },
      include: {
        members: true,
      },
    });
    const _filterRooms: Rooms[] = [];
    rooms.forEach((room) => {
      let IsMember = false;
      room.members.forEach((member) => {
        if (member.userId === User.id) {
          IsMember = true;
        }
      });
      !IsMember && _filterRooms.push(room);
    });
    if (!rooms) null;
    // rooms = rooms.filter((room: Rooms) => {
    //   const member : Members = room.members.

    // });

    // const _filterRooms = rooms.filter((room: Rooms) => {
    //   const member = room.members.find(
    //     (member: Members) => member.userId === User.id,
    //   );
    //   if (member) return true;
    //   return false;
    // });
    return _filterRooms;
  }

  // git all owner roomsÍ
  async findOwnerRooms(roomId: string): Promise<Members[] | null> {
    const rooms = await this.membersservice.findALLForRoom(roomId);
    if (rooms) {
      const ownerRooms = rooms.filter(
        (member: Members) => member.type === 'OWNER',
      );
      if (!ownerRooms) {
        return null;
      }
      return ownerRooms;
    }
    return null;
  }

  // join to room
  async joinToRoom(
    userId: string,
    memberId: string,
    roomId: string,
  ): Promise<Rooms | null> {
    try {
      const room = await this.prisma.rooms.findUnique({
        where: { id: roomId },
        include: { members: true },
      });
      const User = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      const member = await this.prisma.members.findUnique({
        where: { id: memberId },
      });
      if (!room || !User || !member) {
        if (!room)
          throw new NotFoundException(`Room with ID ${roomId} not found`);
        if (!User)
          throw new NotFoundException(`User with ID ${userId} not found`);
        if (!member)
          throw new NotFoundException(`Member with ID ${memberId} not found`);
      }
      // console.log('Chat -- joinToRoom +> :', room, User, member);
      const result = await this.prisma.$transaction(async (prisma) => {
        const room = await prisma.rooms.update({
          where: { id: roomId },
          data: {
            members: { connect: { id: memberId } },
          },
        });
        await prisma.user.update({
          where: { id: userId },
          data: {
            Rooms: { connect: { id: roomId } },
          },
        });
        return room;
      });
      // console.log('Chat -- joinToRoom +> :', result);
      return result;
    } catch (error) {
      console.log('Chat - error -> joinToRoom', error);
      return null;
    }
  }

  // sockets functions :
  async LeaveChanneL(params: {
    userId: string;
    roomId: string;
  }): Promise<Members> {
    try {
      const { userId, roomId } = params;
      // check if room is exist
      const room = await this.prisma.rooms.findUnique({
        where: { id: roomId },
        include: { members: true },
      });
      // check if user is exist
      const User = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!room || !User) {
        if (!room)
          throw new NotFoundException(`Room with ID ${roomId} not found`);
        if (!User)
          throw new NotFoundException(`User with ID ${userId} not found`);
      }
      // check if user is member in room
      const member = await this.membersservice.findOne({
        userId: User.id,
        roomId: room.id,
      });
      if (!member) throw new Error();

      const memberOwners = await this.findOwners({ channeLId: room.id });
      if (memberOwners.length === 1 && memberOwners[0].id === member.userId)
        throw new Error();
      const result = await this.prisma.$transaction(async (prisma) => {
        // disconnect member from room
        const room = await prisma.rooms.update({
          where: { id: roomId },
          data: {
            members: { disconnect: { id: userId } },
          },
        });
        // disconnect room from user
        await prisma.user.update({
          where: { id: userId },
          data: {
            Rooms: { disconnect: { id: roomId } },
          },
        });
        // delete member
        const deletemember = await prisma.members.delete({
          where: { id: member.id },
        });
        return deletemember;
      });
      return result;
    } catch (error) {
      console.log('Chat - error -> LeaveChanneL');
      return null;
    }
  }

  createSlug(name: string) {
    return name
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '') // Remove non-word characters except dashes
      .replace(/\-\-+/g, '-') // Replace consecutive dashes with a single dash
      .replace(/^\-+/, '') // Remove leading dashes
      .replace(/\-+$/, ''); // Remove trailing dashes
  }
}
