import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { UserGateway } from './user.gateway';

@Module({
  providers: [UserService, PrismaService, UserGateway],
  controllers: [UserController],
})
export class UserModule {}
