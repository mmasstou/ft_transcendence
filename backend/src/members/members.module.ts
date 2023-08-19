import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';

@Module({
  controllers: [MembersController],
  providers: [PrismaService, UserService, MembersService],
})
export class MembersModule {}
