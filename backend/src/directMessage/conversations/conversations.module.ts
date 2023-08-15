import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ConversationsService, PrismaService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
