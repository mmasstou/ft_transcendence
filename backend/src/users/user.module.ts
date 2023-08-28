import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Module({
  providers: [UserService, PrismaService, NotificationsGateway],
  controllers: [UserController],
})
export class UserModule {}
