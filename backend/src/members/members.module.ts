import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';

@Module({
  providers: [MembersService, PrismaService, UserService],
  controllers: [MembersController],
})
export class MembersModule {}
