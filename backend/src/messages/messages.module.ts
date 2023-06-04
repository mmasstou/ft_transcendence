import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, UserService],
})
export class MessagesModule {}
