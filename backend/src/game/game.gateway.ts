import { Injectable, OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {Player, Ball, ballSpeed, UserMap, TableMap} from '../../tools/class';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { error } from 'console';
import { UserService } from "src/users/user.service";
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const UserMap: UserMap = new Map();    ////////// list of user connected to the game
const TableMap: TableMap = new Map();    ////////// list of table obj created
var currents: NodeJS.Timeout;
var table_obj = {
    player1: new Player(),
    player2: new Player(),
    ball: new Ball(),
    Status: false,
    current: currents,
    tableId: '',
    GameMode: '',
}
export let _User: User | null = null;

function check_col(table: any){
    if (table.ball.y <= 3 || table.ball.y >= 97.5) // colleg with wall
            table.ball.ball_speed.y = -table.ball.ball_speed.y;
    else if (table.ball.x >= 95.3 && table.ball.y > table.player1.position && table.ball.y < (table.player1.position + 16)) // colleg with player1
    {
        var centerPlayer = table.player1.position + 8;
        var ballOffset = table.ball.y - centerPlayer;
        var ballPositionOnPaddle = ballOffset / 16;
        var maxAngle = Math.PI * 0.9;
        var angle = ballPositionOnPaddle * maxAngle;
        table.ball.ball_speed.x = -Math.cos(angle);
        table.ball.ball_speed.y = Math.sin(angle);
        table.ball.ball_speed.x += table.ball.ball_speed.x > 0 ? table.ball.ballIcrement : -table.ball.ballIcrement;
        table.ball.ball_speed.y += table.ball.ball_speed.y > 0 ? table.ball.ballIcrement : -table.ball.ballIcrement;
        table.ball.ballIcrement += 0.02;
    }
    else if (table.ball.x <= 4.7 && table.ball.y > table.player2.position && table.ball.y < (table.player2.position + 16)) // colleg with player2
    {
        var centerPlayer = table.player2.position + 8;
        var ballOffset = table.ball.y - centerPlayer;
        var ballPositionOnPaddle = ballOffset / 16;
        var maxAngle = Math.PI * 0.9;
        var angle = ballPositionOnPaddle * maxAngle;
        table.ball.ball_speed.x = Math.cos(angle);
        table.ball.ball_speed.y = Math.sin(angle);
        table.ball.ball_speed.x += table.ball.ball_speed.x > 0 ? table.ball.ballIcrement : -table.ball.ballIcrement;
        table.ball.ball_speed.y += table.ball.ball_speed.y > 0 ? table.ball.ballIcrement : -table.ball.ballIcrement;
        table.ball.ballIcrement += 0.02;
    }

}



function moveBall(server: Server, table: any){
    if (table.ball.x > 0 && table.ball.x < 100 && table.ball.y > 0 && table.ball.y < 100) {
      table.ball.x += table.ball.ball_speed.x;
      table.ball.y += table.ball.ball_speed.y;
    }
    else {
        table.ball.ball_speed.x = -table.ball.ball_speed.x;
        table.ball.ball_speed.y = -table.ball.ball_speed.y;
        if (table.ball.x >= 100) {
            table.player2.score += 1;
            table.ball.x = 50;
            server.to(table.tableId + 'ball').emit('setScore2', table.player2.score);
        }
        else {
          table.player1.score += 1;
          table.ball.x = 50;
          server.to(table.tableId + 'ball').emit('setScore1', table.player1.score);
        }
      }
    }
@Injectable()
@WebSocketGateway({namespace: 'game'})
class MyGateway implements OnGatewayConnection {
    constructor(private jwtService: JwtService,private readonly usersService: UserService) {}
    private gameType: string;
    private gameMode: string;
    
    @WebSocketServer()
    server: Server;

    // async CreateFriendTable(data: any) {
    //   if (!UserMap.has(data.player1_Id))
    //     {
    //       const _User = await this.usersService.findOne({ login: data.player1_Id });
    //       UserMap.set(_User.id, {User: _User, Status: 'offline'});
    //     }
    //     if (!UserMap.has(data.player2_Id)) {
    //       const _User = await this.usersService.findOne({ login: data.player2_Id });
    //       UserMap.set(_User.id, {User: _User, Status: 'offline'});
    //     }
    //     table_obj.tableId = uuidv4();
    //     if (UserMap.get(data.player1_Id)
    //     && UserMap.get(data.player2_Id)
    //     && UserMap.get(data.player1_Id).SocketId
    //     && UserMap.get(data.player2_Id).SocketId
    //     && table_obj.tableId) {

    //       const user1 = UserMap.get(data.player1_Id).User;
    //       const user2 = UserMap.get(data.player2_Id).User;
    //       table_obj.GameMode = data.mode;
    //       table_obj.player1.setUserId(data.player1_Id);
    //       table_obj.player2.setUserId(data.player2_Id);
    //       table_obj.player1.GameSetting.setData(user1.bg_color, user1.ball_color, user1.paddle_color, user1.image);
    //       table_obj.player2.GameSetting.setData(user2.bg_color, user2.ball_color, user2.paddle_color, user2.image);
    //       this.server.to(UserMap.get(data.player1_Id).SocketId).emit('joinRoomGame', table_obj);
    //       this.server.to(UserMap.get(data.player2_Id).SocketId).emit('joinRoomGame', table_obj);
    //       TableMap.set(table_obj.tableId, table_obj);
    //       table_obj = {
    //         player1: new Player(),
    //         player2: new Player(),
    //         ball: new Ball(),
    //         Status: false,
    //         current: currents,
    //         tableId: '',
    //         GameMode: '',
    //       }
    //     }
    //   else
    //     {
    //       setTimeout(() => {
    //         this.CreateFriendTable(data);
    //     }, 1000);
    //     }
    // }



    async CreateFriendTable(data: any) {
      return new Promise(async (resolve, reject) => {
        if (!UserMap.has(data.player1_Id))
          {
            const _User = await this.usersService.findOne({ login: data.player1_Id });
            UserMap.set(_User.id, {User: _User, Status: 'offline'});
          }
          if (!UserMap.has(data.player2_Id)) {
            const _User = await this.usersService.findOne({ login: data.player2_Id });
            UserMap.set(_User.id, {User: _User, Status: 'offline'});
          }
          table_obj.tableId = uuidv4();
          if (UserMap.get(data.player1_Id)
          && UserMap.get(data.player2_Id)
          && UserMap.get(data.player1_Id).SocketId
          && UserMap.get(data.player2_Id).SocketId
          && table_obj.tableId) {
  
            const user1 = UserMap.get(data.player1_Id).User;
            const user2 = UserMap.get(data.player2_Id).User;
            table_obj.GameMode = data.mode;
            table_obj.player1.setUserId(data.player1_Id);
            table_obj.player2.setUserId(data.player2_Id);
            table_obj.player1.GameSetting.setData(user1.bg_color, user1.ball_color, user1.paddle_color, user1.image);
            table_obj.player2.GameSetting.setData(user2.bg_color, user2.ball_color, user2.paddle_color, user2.image);
            this.server.to(UserMap.get(data.player1_Id).SocketId).emit('joinRoomGame', table_obj);
            this.server.to(UserMap.get(data.player2_Id).SocketId).emit('joinRoomGame', table_obj);
            TableMap.set(table_obj.tableId, table_obj);
            resolve(table_obj.tableId);
            table_obj = {
              player1: new Player(),
              player2: new Player(),
              ball: new Ball(),
              Status: false,
              current: currents,
              tableId: '',
              GameMode: '',
            }
          }
        else
          {
            setTimeout(() => {
              this.CreateFriendTable(data).then(resolve).catch(reject);
          }, 1000);
          }
      });
    }


    async CreateBotTable(data: any) {
      return new Promise(async (resolve, reject) => {
        if (!UserMap.has(data.player_Id)) {
          const _User = await this.usersService.findOne({ login: data.player_Id });
          UserMap.set(_User.id, {User: _User, Status: 'offline'});
        }
        if (UserMap.get(data.player_Id) && UserMap.get(data.player_Id).SocketId && UserMap.get(data.player_Id).BallSocketId) {
          const user = UserMap.get(data.player_Id).User;
          table_obj.tableId = uuidv4();
          table_obj.GameMode = data.mode;
          table_obj.player1.setUserId(data.player_Id);
          table_obj.player2.setUserId('Bot');
          table_obj.player1.GameSetting.setData(user.bg_color, user.ball_color, user.paddle_color, user.image);
          table_obj.player2.GameSetting.setData(user.bg_color, user.ball_color, user.paddle_color, "avatarBot.png");
          this.server.to(UserMap.get(data.player_Id).SocketId).emit('joinRoomGame', table_obj);
          TableMap.set(table_obj.tableId, table_obj);
          resolve(table_obj.tableId);

          table_obj = {
            player1: new Player(),
            player2: new Player(),
            ball: new Ball(),
            Status: false,
            current: currents,
            tableId: '',
            GameMode: '',
        }
        } else {
          setTimeout(() => {
            this.CreateBotTable(data).then(resolve).catch(reject);
          }, 1000);
        }
      });
    }

    async handleConnection(socket: Socket) {
      const { token } = socket.handshake.auth; // Extract the token from the auth object
      let payload: any = '';
      try {
        if (!token) {
          throw new UnauthorizedException();
        }
        payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        const login: string = payload.sub;
        _User = await this.usersService.findOne({ login });
      } catch {
        console.log('+> not valid token', error);
      }
      console.log('+-> Client',_User.login , 'connected');
      UserMap.set(_User.id, {User: _User, SocketId: socket.id, Status: 'online'});
      if (socket.handshake.auth.tableId)
        socket.emit('joinRoomGame', TableMap.get(socket.handshake.auth.tableId));
    }

    handleDisconnect(socket: Socket) {
      console.log('Client disconnected', socket.id);
      if (UserMap.has(_User.id))
        UserMap.delete(_User.id);
    }
    @SubscribeMessage('joinToRoomGame')
    JoinToRoomGame(client: any, data: any) {
      client.join(data);
      this.server.to(data).emit('ready', true);
    }

    @SubscribeMessage('setPlayer1')
    SetPlayer1(client: any, data: any) {
      TableMap.get(data.tableId).player1.position = data.Player;
      this.server.to(data.tableId).emit('setPlayer1', data.Player);
    }

    @SubscribeMessage('setPlayer2')
    SetPlayer2(client: any, data: any) {
      TableMap.get(data.tableId).player2.position = data.Player;
      this.server.to(data.tableId).emit('setPlayer2', data.Player);
    }

    @SubscribeMessage('setBot')
    SetBot(client: any, data: any) {
      TableMap.get(data.tableId).player2.position = data.Player;
    }

    
    @SubscribeMessage('setStatus')
    SetStatus(client:any, data: any) {
      TableMap.get(data.tableId).Status = data.status;
      this.server.to(data.tableId).emit('setStatus', data.status);
    }
}

@WebSocketGateway({namespace: 'ball'})
class BallGateway implements OnGatewayConnection {
    constructor(private jwtService: JwtService,private readonly usersService: UserService) {}
    @WebSocketServer()
    server: Server;

    CreateFriendTable(data: any, id: any) {
      if (UserMap.get(data.player1_Id) && UserMap.get(data.player1_Id).SocketId && UserMap.get(data.player1_Id).BallSocketId && UserMap.get(data.player2_Id) && UserMap.get(data.player2_Id).SocketId && UserMap.get(data.player2_Id).BallSocketId)
      {
        this.server.to(UserMap.get(data.player1_Id).BallSocketId).emit('joinRoomBall', id);
        this.server.to(UserMap.get(data.player2_Id).BallSocketId).emit('joinRoomBall', id);
      }
    }

    async CreateBotTable(data: any, id: any) {
      if (UserMap.get(data.player_Id) && UserMap.get(data.player_Id).SocketId && UserMap.get(data.player_Id).BallSocketId)
        this.server.to(UserMap.get(data.player_Id).BallSocketId).emit('joinRoomBall', id);
    }

    async handleConnection(socket: Socket) {
        const { token } = socket.handshake.auth; // Extract the token from the auth object
        let payload: any = '';
        try {
          if (!token) {
            throw new UnauthorizedException();
          }
          payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET,
          });
          const login: string = payload.sub;
          _User = await this.usersService.findOne({ login });
        } catch {
          console.log('+> not valid token', error);
        }
        console.log('+-> Client',_User.login , 'connected to ball');
        UserMap.get(_User.id).BallSocketId = socket.id;
    }

    @SubscribeMessage('joinToRoomBall')
    JoinToRoomBall(client: any, data: any) {
      client.join(data + 'ball');
    }



    @SubscribeMessage('moveBall')
    MoveBall(client: any, data: any) {
        clearInterval(TableMap.get(data).current);
        if (TableMap.get(data).Status) {
          TableMap.get(data).current = setInterval(() => {
            check_col(TableMap.get(data));
            moveBall(this.server, TableMap.get(data));
                if (TableMap.get(data).Status == false){
                  clearInterval(TableMap.get(data).current);
                }
                this.server.to(data + 'ball').emit('setBall', TableMap.get(data).ball);
            }, 30);
        }
    }
}


export {MyGateway, BallGateway}



