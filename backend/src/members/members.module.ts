import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';
import { AppModule } from 'src/app.module';

@Module({
  controllers: [MembersController],
  providers: [MembersService, PrismaService, UserService],
  imports: [],
})
export class MembersModule {}
