import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { PrismaService } from 'src/prisma.service';
import { DmGateway } from './dm.gateway';
import { MessagesService } from './messages/messages.service';

@Module({
  providers: [ConversationsService, PrismaService, DmGateway, MessagesService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
