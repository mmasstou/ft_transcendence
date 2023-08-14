import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { MyGateway, BallGateway } from './game.gateway';

@Controller('game')
export class GameController {
  constructor(
    private GameGateway: MyGateway,
    private BallGateway: BallGateway,
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
}
