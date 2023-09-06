import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { UserGateway } from './user.gateway';
import { RoomGateway } from 'src/rooms/rooms.gateway';
import { RoomsModule } from 'src/rooms/rooms.module';
import { RoomsService } from 'src/rooms/rooms.service';
import { MembersService } from 'src/members/members.service';
import { MessagesService } from 'src/messages/messages.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { DmService } from 'src/dm/dm.service';
import { DmGateway } from 'src/dm/dm.gateway';

@Module({
  providers: [
    UserService,
    PrismaService,
    RoomsService,
    MembersService,
    MessagesService,
    UserGateway,
    RoomGateway,
    DmService,
    DmGateway,
    NotificationsGateway,
  ],
  controllers: [UserController],
  imports: [RoomsModule],
})
export class UserModule {}
