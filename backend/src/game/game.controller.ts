import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { MyGateway } from './game.gateway';
import { PrismaService } from 'src/prisma.service';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(
    private GameGateway: MyGateway,
    private prisma: PrismaService,
    private GameService: GameService,
  ) {}

  @Post('/FriendGame')
  async selectFriendGame(@Body() body: {player1Id: string; player2Id: string; mode: string}) {
    try {
      const result = await this.GameGateway.CreateFriendTable(body);
      if (result != undefined)
        throw new HttpException(
          { reason: result.message },
          HttpStatus.CONFLICT,
        );
    } catch (err) {
      throw new HttpException({ reason: err.response.reason }, HttpStatus.CONFLICT);
    }
  }

  @Post('/BotGame')
  async selectBotGame(@Body() body: {playerId: string; mode: string}) {
    try {
      const result = await this.GameGateway.CreateBotTable(body);
      if (result != undefined)
        throw new HttpException(
          { reason: result.message },
          HttpStatus.CONFLICT,
        );
    } catch (err) {
      throw new HttpException(
        { reason: err.response.reason },
        HttpStatus.CONFLICT,
      );
    }
  }

  @Post('/RandomGame')
  async selectRandomGame(@Body() body: {playerId: string; mode: string}) {
    try {
      const result = await this.GameGateway.CreateRandomTable(body);
      if (result != undefined) {
        throw new HttpException(
          { reason: result.message },
          HttpStatus.CONFLICT,
        );
      }
    } catch (err) {
      throw new HttpException(
        { reason: err.response.reason },
        HttpStatus.CONFLICT,
      );
    }
  }

  @Post('/leaveGame')
  leaveGame(@Body() body: {UserId: string; TableId: string}) {
    this.GameGateway.LeaveGame(body);
  }


  @Get('/GetScore/:id')
  async getUserScores(@Param('id') userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        MyScore: true,
        Other: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const matchList = user.MyScore.concat(user.Other);
    const sortedmatchList = matchList.sort((item1, item2) => {
      if (item1.created_at < item2.created_at) {
        return -1;
      }
      if (item1.created_at > item2.created_at) {
        return 1;
      }
      return 0;
    });

    return matchList;
  }


  @Post('/UpdateTheme')
  async updateTheme(@Body() body: {id: string; theme: {background: string[], paddle: string, ball: string;}}) {
    try {
      await this.GameService.updateTheme(body);
    } 
    catch (err) {
      throw new HttpException(
        { reason: 'User not found'},
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
