// import { useRef } from "react";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {Player, Ball, ballSpeed, UserMap, TableMap} from 'G_Class/class';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { error } from 'console';
import { UserService } from "src/users/user.service";
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const UserMap: UserMap = new Map();    ////////// list of user connected to the game

const TableMap: TableMap = new Map();    ////////// list of table obj created

var table_obj = {
    player1: new Player(),
    player2: new Player(),
    ball: new Ball(),
    Status: false,
    tableId: '',
    GameMode: '',
}
var current: NodeJS.Timeout;

function check_col(table: any){
    if (table.ball.y <= 2 || table.ball.y >= 98) // colleg with wall
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
    }
    else if (table.ball.x <= 4.2 && table.ball.y > table.player2.position && table.ball.y < (table.player2.position + 16)) // colleg with player2
    {
        var centerPlayer = table.player2.position + 8;
        var ballOffset = table.ball.y - centerPlayer;
        var ballPositionOnPaddle = ballOffset / 16;
        var maxAngle = Math.PI * 0.9;
        var angle = ballPositionOnPaddle * maxAngle;
        table.ball.ball_speed.x = Math.cos(angle);
        table.ball.ball_speed.y = Math.sin(angle);
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
            server.emit('setScore2', table.player2.score);
        }
        else {
            table.player1.score += 1;
            table.ball.x = 50;
            server.emit('setScore1', table.player1.score);
        }
    }
  }

// @WebSocketGateway()
// class MyGateway implements OnModuleInit {
//     @WebSocketServer()
//     server: Server;
    
//     onModuleInit() {
//         this.server.on('connection', (socket) => {
//             console.log('+-> Client',socket.handshake.auth.Username , 'connected');
//             socket.on('disconnect', () => {
//                 if (table_obj.id1 == socket.id) {
//                     table_obj.id1 = '';}
//                 else if (table_obj.id2 == socket.id) {
//                     table_obj.id2 = '';
//                 }
//                 socket.disconnect();
//                 console.log('disconnected', socket.id);
//             });
//             if (table_obj.player1.UserId == '' || table_obj.player1.UserId == socket.handshake.auth.UserId) {
//                 table_obj.player1.setUserId(socket.handshake.auth.UserId);
//                 this.server.emit('update', table_obj);
//             }
//             else if (table_obj.player2.UserId == '' && socket.handshake.auth.UserId != table_obj.player1.UserId) {
//                 table_obj.player2.setUserId(socket.handshake.auth.UserId);
//                 this.server.emit('update', table_obj);
//             }
//             else if (socket.handshake.auth.UserId != table_obj.player1.UserId && socket.handshake.auth.UserId != table_obj.player2.UserId) {
//                 table_obj.player1.setUserId(socket.handshake.auth.UserId);
//                 table_obj.player2.setUserId('');
//                 this.server.emit('update', table_obj);
//             }
//         });
//     }



//     @SubscribeMessage('setPlayer1')
//     SetPlayer1(client: any, data: any) {
//         table_obj.player1.position = data;
//         this.server.emit('setPlayer1', data);
//         // this.server.to(body.room).emit('message', {titile: 'new message from the server', content: body})
//     }

//     @SubscribeMessage('getData')
//     GetData(client: any, data: any) {
//         this.server.emit('getData', table_obj);
//     }

//     @SubscribeMessage('setPlayer2')
//     SetPlayer2(client: any, data: any) {
//         table_obj.player2.position = data;
//         // this.server.emit('update', table_obj);
//         this.server.emit('setPlayer2', data);
//     }


//     // @SubscribeMessage('setBall')
//     // SetBall(client: any, data: any) {
//     //     // console.log('data :', data);
//     //     // table_obj.ball = data;
//     //     // this.server.emit('update', table_obj);
//     //     this.server.emit('setBall', table_obj);
//     // }
    
//     @SubscribeMessage('setStatus')
//     SetStatus(client:any, data: boolean) {
//         table_obj.Status = data;
//         console.log('data :', client);
//         this.server.emit('setStatus', data);
//         // console.log(data, table_obj);
//     }

//     @SubscribeMessage('setSize')
//     SetSize(client:any, data: any) {
//         table_obj.SizeCanvas = data;
//     }
// }


export let _User: User | null = null;
@Injectable()
@WebSocketGateway({namespace: 'game'})
class MyGateway implements OnGatewayConnection {
    constructor(private jwtService: JwtService,private readonly usersService: UserService) {}
    private gameType: string;
    private gameMode: string;
    
    @WebSocketServer()
    server: Server;

    // setGameType(gameType: string) {
    //   this.gameType = gameType;
    // }
  
    // setPlayerMode(playerMode: string) {
    //   this.gameMode = playerMode;
    // }


    async CreateFriendTable(data: any) {
      if (!UserMap.has(data.player1_Id)) {
        const _User = await this.usersService.findOne({ login: data.player1_Id });
        UserMap.set(_User.id, {User: _User, Status: 'offline'});
      }
      if (!UserMap.has(data.player2_Id)) {
        const _User = await this.usersService.findOne({ login: data.player2_Id });
        UserMap.set(_User.id, {User: _User, Status: 'offline'});
      }
      if (UserMap.get(data.player1_Id)
      && UserMap.get(data.player2_Id)
      && UserMap.get(data.player1_Id).SocketId
      && UserMap.get(data.player2_Id).SocketId) {

        const user1 = UserMap.get(data.player1_Id).User;
        const user2 = UserMap.get(data.player2_Id).User;
        table_obj.tableId = uuidv4();
        table_obj.GameMode = data.mode;
        table_obj.player1.setUserId(data.player1_Id);
        table_obj.player2.setUserId(data.player2_Id);
        table_obj.player1.GameSetting.setData(user1.bg_color, user1.ball_color, user1.paddle_color, user1.image);
        table_obj.player2.GameSetting.setData(user2.bg_color, user2.ball_color, user2.paddle_color, user2.image);
        this.server.to(UserMap.get(data.player1_Id).SocketId).emit('joinRoomGame', table_obj);
        this.server.to(UserMap.get(data.player2_Id).SocketId).emit('joinRoomGame', table_obj);
        TableMap.set(table_obj.tableId, table_obj);
        console.log('friend ', TableMap);
        // console.log('friend user', UserMap);
      }
      else
      {
        setTimeout(() => {
          this.CreateFriendTable(data);
      }, 1000);
      }
    }

    async CreateBotTable(data: any) {
      // console.log('bot ', data);
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
        // console.log('bot ', table_obj);
        table_obj.player1.GameSetting.setData(user.bg_color, user.ball_color, user.paddle_color, user.image);
        table_obj.player2.GameSetting.setData(user.bg_color, user.ball_color, user.paddle_color, "avatarBot.png");
        this.server.to(UserMap.get(data.player_Id).SocketId).emit('joinRoomGame', table_obj);
        // console.log('bot ', UserMap.get(data.player_Id).BallSocketId);
        // this.server.to(UserMap.get(data.player_Id).BallSocketId).emit('joinRoomBall', table_obj);
        TableMap.set(table_obj.tableId, table_obj);
        // table_obj.ball = new Ball();

      }
      else {
        // console.log('bot timeout');
        setTimeout(() => {
          this.CreateBotTable(data);
      }, 1000);
      }
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
        // console.log('----------data***: ', _User);
        UserMap.set(_User.id, {User: _User, SocketId: socket.id, Status: 'online'});
        // console.log(UserMap.get(_User.id));
        if (socket.handshake.auth.tableId)
          socket.emit('joinRoomGame', TableMap.get(socket.handshake.auth.tableId));
        // if (table_obj.player1.UserId == '' || table_obj.player1.UserId == _User.id) {
        //     // console.log('player1', _User.bg_color);
        //     table_obj.player1.setUserId(_User.id);
        //     // console.log('player1', _User);
        //     table_obj.player1.GameSetting.table = _User.bg_color;
        //     table_obj.player1.GameSetting.player = _User.paddle_color;
        //     table_obj.player1.GameSetting.ball = _User.ball_color;
        //     table_obj.player1.GameSetting.avatar = _User.image;
        //     // console.log("data***: ", table_obj);
        //     this.server.emit('update', table_obj);
        //     table_obj.player2.UserId && this.server.emit('ready', true);
        //     this.server.emit('image', true);
        // }
        // else if ((table_obj.player2.UserId == '' && _User.id != table_obj.player1.UserId) || table_obj.player2.UserId == _User.id) {
        //     table_obj.player2.setUserId(_User.id);
        //     // console.log('player2', _User);
        //     table_obj.player2.GameSetting.table = _User.bg_color;
        //     table_obj.player2.GameSetting.player = _User.paddle_color;
        //     table_obj.player2.GameSetting.ball = _User.ball_color;
        //     table_obj.player2.GameSetting.avatar = _User.image;
        //     // console.log("data***: ", table_obj);
        //     this.server.emit('update', table_obj);
        //     this.server.emit('image', true);
        //     this.server.emit('ready', true);
        // }
        // else if (_User.id != table_obj.player1.UserId && _User.id != table_obj.player2.UserId) {
        //     table_obj.player1.setUserId(_User.id);
        //     table_obj.player2.setUserId('');
        //     this.server.emit('update', table_obj);
        // }
        // console.log('data***: ', UserMap);
        
      }

    handleDisconnect(socket: Socket) {
      console.log('Client disconnected', socket.id);
      if (UserMap.has(_User.id))
        UserMap.delete(_User.id);
      // console.log('----------data***: ', UserMap);
    
    }
    @SubscribeMessage('joinToRoomGame')
    JoinToRoomGame(client: any, data: any) {
      client.join(data);
      this.server.to(data).emit('ready', true);
      // client.id === TableMap.get(data)
      // console.log('data :', TableMap.get(data).player2.UserId, client.id);
      // console.log('data :', UserMap.get(TableMap.get(data).player2.UserId).SocketId, client.id);
      // this.server.to(data).emit('ready', true);
      // console.log('data :', data, client);
      // Socket.join(data);
    }

    @SubscribeMessage('setPlayer1')
    SetPlayer1(client: any, data: any) {
      TableMap.get(data.tableId).player1.position = data.Player;
      this.server.to(data.tableId).emit('setPlayer1', {Player: data.Player, tableId: data.tableId});
      // console.log('data socket :', client);
        // table_obj.player1.position = data;
        // this.server.emit('setPlayer1', data);
        // this.server.to(body.room).emit('message', {titile: 'new message from the server', content: body})
    }


    @SubscribeMessage('setPlayer2')
    SetPlayer2(client: any, data: any) {
      TableMap.get(data.tableId).player2.position = data.Player;
      this.server.to(data.tableId).emit('setPlayer2', data.Player);
        // table_obj.player2.position = data;
        // this.server.emit('update', table_obj);
        // this.server.emit('setPlayer2', data);
    }


    // @SubscribeMessage('getData')
    // GetData(client: any, data: any) {
    //     this.server.emit('getData', table_obj);
    // }
    @SubscribeMessage('setBot')
    SetBot(client: any, data: any) {
      TableMap.get(data.tableId).player2.position = data.Player;
        // table_obj.player2.position = data;
    }
    
    @SubscribeMessage('setStatus')
    SetStatus(client:any, data: any) {
      // console.log('data :', TableMap);
      TableMap.get(data.tableId).Status = data.status;
      // console.log('data status :', data.status);
      this.server.to(data.tableId).emit('setStatus', data.status);
      // this.server.emit('setStatus', data.status);
      // console.log(data);
        // table_obj.Status = data;
        // console.log('data :', table_obj);
        // console.log(data, table_obj);
    }

    // @SubscribeMessage('setSize')
    // SetSize(client:any, data: any) {
    //     table_obj.SizeCanvas = data;
    // }
}

@WebSocketGateway({namespace: 'ball'})
class BallGateway implements OnGatewayConnection {
    constructor(private jwtService: JwtService,private readonly usersService: UserService) {}
    @WebSocketServer()
    server: Server;


    async CreateBotTable(data: any) {
      // console.log('bot ', data);
      if (UserMap.get(data.player_Id) && UserMap.get(data.player_Id).SocketId && UserMap.get(data.player_Id).BallSocketId) {
        // const user = UserMap.get(data.player_Id).User;
        // table_obj.tableId = uuidv4();
        // table_obj.GameMode = data.mode;
        // table_obj.player1.setUserId(data.player_Id);
        // table_obj.player2.setUserId('Bot');
        // // console.log('bot ', table_obj);
        // table_obj.player1.GameSetting.setData(user.bg_color, user.ball_color, user.paddle_color, user.image);
        // table_obj.player2.GameSetting.setData(user.bg_color, user.ball_color, user.paddle_color, "avatarBot.png");
        // this.server.to(UserMap.get(data.player_Id).SocketId).emit('joinRoomGame', table_obj);
        // // console.log('bot ', UserMap.get(data.player_Id).BallSocketId);
        this.server.to(UserMap.get(data.player_Id).BallSocketId).emit('joinRoomBall');
        // TableMap.set(table_obj.tableId, table_obj);
      }
      // else {
      //   // console.log('bot timeout');
      //   setTimeout(() => {
      //     this.CreateBotTable(data);
      // }, 1000);
      // }
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
        //   console.log('payload :', payload);
          const login: string = payload.sub;
          _User = await this.usersService.findOne({ login });
        //   console.log('user :', _User);
        } catch {
          console.log('+> not valid token', error);
        }
        console.log('+-> Client',_User.login , 'connected to ball');
        UserMap.get(_User.id).BallSocketId = socket.id;
        // console.log('data***: ', UserMap.get(_User.id));
        // console.log(UserMap);
    }


    @SubscribeMessage('joinToRoomBall')
    JoinToRoomBall(client: any, data: any) {
      client.join(data + 'ball');
      console.log('data join :', client.id, this.server);
    }


    @SubscribeMessage('moveBall')
    MoveBall(client: any, data: any) {
        clearInterval(current);
        // console.log('data ----:',TableMap.get(data).Status);
        if (TableMap.get(data).Status) {
            current = setInterval(() => {
                check_col(TableMap.get(data));
                moveBall(this.server, TableMap.get(data));
                this.server.to(data + 'ball').emit('setBall', TableMap.get(data).ball);
                // this.server.emit('setBall', table_obj.ball);
                if (TableMap.get(data).Status == false){
                  clearInterval(current);
                }
            }, 15);
        }
    }
}


export {MyGateway, BallGateway}


