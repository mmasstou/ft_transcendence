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

@Controller('game')
export class GameController {
  constructor(
    private GameGateway: MyGateway,
    private prisma: PrismaService,
  ) {}

  @Post('/FriendGame')
  async selectFriendGame(@Body() body: any) {
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
  /** {       ///////////////////////////////////////////////////////// body
        "player1Id": "25deb8bc-f2f7-45eb-9079-9969696b71fe",
        "player2Id": "2c8f719b-ddb0-430c-bb73-42460cc33a3a",
        "mode": "time" / "score"
        } */

  @Post('/BotGame')
  async selectBotGame(@Body() body: any) {
    try {
      const result = await this.GameGateway.CreateBotTable(body);
      if (result != undefined)
        throw new HttpException(
          { reason: result.message },
          HttpStatus.CONFLICT,
        );
    } catch (err) {
      // console.log(err);
      throw new HttpException(
        { reason: err.response.reason },
        HttpStatus.CONFLICT,
      );
    }
  }

  /** {       ///////////////////////////////////////////////////////// body
        "playerId": "25deb8bc-f2f7-45eb-9079-9969696b71fe",
        "mode": "time"
        } */

  @Post('/RandomGame')
  async selectRandomGame(@Body() body: any) {
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
  /** {       ///////////////////////////////////////////////////////// body
        "playerId": "25deb8bc-f2f7-45eb-9079-9969696b71fe",
        "mode": "time"
        } */

  @Post('/leaveGame')
  leaveGame(@Body() body: any) {
    // console.log("body: ", body);
    this.GameGateway.LeaveGame(body);
    // const promise = this.GameGateway.LeaveGame(body);
  }

  /**{       ///////////////////////////////////////////////////////// body
        "table_Id": "25deb8bc-f2f7-45eb-9079-9969696b71fe",
        } */

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
}
