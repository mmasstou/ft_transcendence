import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { PrismaService } from 'src/prisma.service';
import { DmGateway } from './dm.gateway';

@Module({
  providers: [ConversationsService, PrismaService],
  controllers: [ConversationsController, DmGateway],
})
export class ConversationsModule {}
