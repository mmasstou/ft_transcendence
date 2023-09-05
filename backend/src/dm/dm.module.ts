import { Module } from '@nestjs/common';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';
import { DmGateway } from './dm.gateway';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  controllers: [DmController],
  providers: [
    DmService,
    DmGateway,
    PrismaService,
    UserService,
    MessagesService,
  ],
})
export class DmModule {}
