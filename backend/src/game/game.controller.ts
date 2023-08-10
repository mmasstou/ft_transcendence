import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MyGateway, BallGateway } from './game.gateway';
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';

@Controller('game')
export class GameController {
  constructor(
    private GameGateway: MyGateway,
    private BallGateway: BallGateway,
  ) {}

  @Post('/FriendGame')
  selectFriendGame(@Body() body: any) {
    const promise = this.GameGateway.CreateFriendTable(body);
    promise.then((tableId) => {
      this.BallGateway.CreateFriendTable(body, tableId);
    });
  }
  /** {       ///////////////////////////////////////////////////////// body
        "player1_Id": "25deb8bc-f2f7-45eb-9079-9969696b71fe",
        "player2_Id": "2c8f719b-ddb0-430c-bb73-42460cc33a3a",
        "mode": "time"
        } */

  @Post('/BotGame')
  async selectBotGame(@Body() body: any) {
    const promise = this.GameGateway.CreateBotTable(body);
    promise.then((res) => {
      this.BallGateway.CreateBotTable(body, res);
    });
  }
  /** {       ///////////////////////////////////////////////////////// body
        "player_Id": "25deb8bc-f2f7-45eb-9079-9969696b71fe",
        "mode": "time"
        } */

  @Post('/RandomGame')
  async selectRandomGame(@Body() body: any) {
    const promise = this.GameGateway.CreateRandomTable(body);
    promise.then((res) => {
      this.BallGateway.CreateRandomTable(body, res);
    });
  }
  /** {       ///////////////////////////////////////////////////////// body
        "player_Id": "25deb8bc-f2f7-45eb-9079-9969696b71fe",
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
