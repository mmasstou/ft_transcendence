import { Module } from '@nestjs/common';
import { DirectMessageController } from './direct-message.controller';
import { DirectMessageService } from './direct-message.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';

@Module({
  controllers: [DirectMessageController],
  providers: [DirectMessageService, PrismaService, UserService],
})
export class DirectMessageModule {}
