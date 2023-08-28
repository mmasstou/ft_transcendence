import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { BallGateway, MyGateway } from './game.gateway';
import { UserService } from 'src/users/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [GameService, UserService, MyGateway, BallGateway, PrismaService],
  controllers: [GameController],
})
export class GameModule {}
