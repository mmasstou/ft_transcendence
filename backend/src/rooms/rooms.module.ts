import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';
import { MembersService } from 'src/members/members.service';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  controllers: [RoomsController],
  providers: [
    RoomsService,
    PrismaService,
    UserService,
    MembersService,
    MessagesService,
  ],
})
export class RoomsModule {}
