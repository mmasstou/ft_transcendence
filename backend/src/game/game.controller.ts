import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MyGateway, BallGateway} from './game.gateway';

@Controller('game')
export class GameController {
    constructor(
        private GameGateway: MyGateway,
        private BallGateway: BallGateway,
        ) {}

    @Post('/FriendGame')
    selectFriendGame(@Body() body: any) {
        const promise = this.GameGateway.CreateFriendTable(body);
        promise.then((res) => {
            // console.log("promise--------------> ",res, body);
            this.BallGateway.CreateFriendTable(body, res);
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
        "player1_Id": "25deb8bc-f2f7-45eb-9079-9969696b71fe",
        "mode": "time"
        } */

    // @Get()
    // getSignup() {
    //     console.log("test") 
    // }
}


