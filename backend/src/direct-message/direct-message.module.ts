import { Module } from '@nestjs/common';
import { DirectMessageController } from './direct-message.controller';
import { DirectMessageService } from './direct-message.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';
import { MembersService } from 'src/members/members.service';

@Module({
  controllers: [DirectMessageController],
  providers: [DirectMessageService, PrismaService, UserService, MembersService],
})
export class DirectMessageModule {}
