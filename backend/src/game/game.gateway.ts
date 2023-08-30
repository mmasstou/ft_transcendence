import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { error } from 'console';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/users/user.service';
import { v4 as uuidv4 } from 'uuid';
import { TableObj, UniqueSet, UserMap, TableMap, random_obj} from './types';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { GameService } from './game.service';

const UserMap: UserMap = new Map(); ////////// list of user connected to the game
const TableMap: TableMap = new Map(); ////////// list of table obj created
const RandomListTime = new UniqueSet(); ////////// list of random time obj created
const RandomListScore = new UniqueSet(); ////////// list of random score obj created
let currents: NodeJS.Timeout;
let table_obj = new TableObj(currents);

export let _User: User | null = null;

function check_col(table: TableObj) {
  if (table.ball.y <= 3 || table.ball.y >= 97.5)
    // colleg with wall
    table.ball.ball_speed.y = -table.ball.ball_speed.y;
  else if (
    table.ball.x >= 95.3 &&
    table.ball.y > table.player1.position &&
    table.ball.y < table.player1.position + 16
  ) {
    // colleg with player1
    const centerPlayer = table.player1.position + 8;
    const ballOffset = table.ball.y - centerPlayer;
    const ballPositionOnPaddle = ballOffset / 16;
    const maxAngle = Math.PI * 0.9;
    const angle = ballPositionOnPaddle * maxAngle;
    table.ball.ball_speed.x = -Math.cos(angle);
    table.ball.ball_speed.y = Math.sin(angle);
  } else if (
    table.ball.x <= 4.7 &&
    table.ball.y > table.player2.position &&
    table.ball.y < table.player2.position + 16
  ) {
    // colleg with player2
    const centerPlayer = table.player2.position + 8;
    const ballOffset = table.ball.y - centerPlayer;
    const ballPositionOnPaddle = ballOffset / 16;
    const maxAngle = Math.PI * 0.9;
    const angle = ballPositionOnPaddle * maxAngle;
    table.ball.ball_speed.x = Math.cos(angle);
    table.ball.ball_speed.y = Math.sin(angle);
  }
}

function moveBall(server: Server, table: TableObj) {
  if (
    table.ball.x > 3 &&
    table.ball.x < 97 &&
    table.ball.y > 0 &&
    table.ball.y < 100
  ) {
    table.ball.x += table.ball.ball_speed.x;
    table.ball.y += table.ball.ball_speed.y;
  } else {
    table.ball.ball_speed.x = -table.ball.ball_speed.x;
    table.ball.ball_speed.y = -table.ball.ball_speed.y;
    if (table.ball.x >= 97) {
      table.player2.score += 1;
      table.ball.x = 50;
      table.intervaldelay = 30;
      server.to(table.tableId + 'ball').emit('setScore2', table.player2.score);
    } else {
      table.player1.score += 1;
      table.ball.x = 50;
      table.intervaldelay = 30;
      server.to(table.tableId + 'ball').emit('setScore1', table.player1.score);
    }
  }
}

async function SetUserMatchNumber(
  gameService: GameService,
  Win: string,
  Lose: string,
  diff: number,
) {
  if (Lose === 'Bot') {
    await gameService.setMachine({ id: Win });
  }
  const user1 = Win != 'Bot' ? UserMap.get(Win) : null;
  const user2 = Lose != 'Bot' ? UserMap.get(Lose) : null;
  user1 &&
    (await gameService.updateTotalMatches({
      id: Win,
      TotalWin: user1.User.TotalWin + 1,
      TotalLose: user1.User.TotalLose,
      TotalDraw: user1.User.TotalDraw,
    }));
  user2 &&
    (await gameService.updateTotalMatches({
      id: Lose,
      TotalWin: user2.User.TotalWin,
      TotalLose: user2.User.TotalLose + 1,
      TotalDraw: user2.User.TotalDraw,
    }));
  user1 &&
    (await gameService.updateTotalMatch({
      id: Win,
      TotalMatch: user1.User.TotalMatch + 1,
    }));
  user2 &&
    (await gameService.updateTotalMatch({
      id: Lose,
      TotalMatch: user2.User.TotalMatch + 1,
    }));

  if (Lose === 'Bot' || Win === 'Bot') return;
  user1 &&
    (await gameService.updateLevel({
      id: Win,
      level: parseFloat((user1.User.Level + diff * 0.1).toFixed(1)),
    }));
}

async function setcleanSheet(gameService: GameService, user: string) {
  await gameService.setcleanSheet({ id: user });
}

function setUserDraw(gameService: GameService, Win: string, Lose: string) {
  if (Lose === 'Bot' || Win === 'Bot') return;
  const user1 = UserMap.get(Win);
  const user2 = UserMap.get(Lose);
  gameService.updateTotalMatches({
    id: Win,
    TotalWin: user1.User.TotalWin,
    TotalLose: user1.User.TotalLose,
    TotalDraw: user1.User.TotalDraw + 1,
  });
  gameService.updateTotalMatches({
    id: Lose,
    TotalWin: user2.User.TotalWin,
    TotalLose: user2.User.TotalLose,
    TotalDraw: user2.User.TotalDraw + 1,
  });
  gameService.updateTotalMatch({
    id: Win,
    TotalMatch: user1.User.TotalMatch + 1,
  });
  gameService.updateTotalMatch({
    id: Lose,
    TotalMatch: user2.User.TotalMatch + 1,
  });
}

@WebSocketGateway({ namespace: 'ball' })
class BallGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}
  @WebSocketServer()
  server: Server;

  async CreateFriendTable(
    data: { player1Id: string; player2Id: string },
    id: string,
  ) {
    if (
      UserMap.get(data.player1Id) &&
      UserMap.get(data.player1Id).SocketId &&
      UserMap.get(data.player1Id).BallSocketId &&
      UserMap.get(data.player2Id) &&
      UserMap.get(data.player2Id).SocketId &&
      UserMap.get(data.player2Id).BallSocketId
    ) {
      this.server
        .to(UserMap.get(data.player1Id).BallSocketId)
        .emit('joinRoomBall', id);
      this.server
        .to(UserMap.get(data.player2Id).BallSocketId)
        .emit('joinRoomBall', id);
    }
  }

  async CreateRandomTable(Tableobj: TableObj) {
    if (
      Tableobj.player1 &&
      UserMap.get(Tableobj.player1.UserId) &&
      UserMap.get(Tableobj.player1.UserId).SocketId &&
      UserMap.get(Tableobj.player1.UserId).BallSocketId &&
      Tableobj.player2 &&
      UserMap.get(Tableobj.player2.UserId) &&
      UserMap.get(Tableobj.player2.UserId).SocketId &&
      UserMap.get(Tableobj.player2.UserId).BallSocketId
    ) {
      this.server
        .to(UserMap.get(Tableobj.player1.UserId).BallSocketId)
        .emit('joinRoomBall', Tableobj.tableId);
      this.server
        .to(UserMap.get(Tableobj.player2.UserId).BallSocketId)
        .emit('joinRoomBall', Tableobj.tableId);
    }
  }

  async CreateBotTable(data: { playerId: string }, id: string) {
    if (
      UserMap.get(data.playerId) &&
      UserMap.get(data.playerId).SocketId &&
      UserMap.get(data.playerId).BallSocketId
    ) {
      this.server
        .to(UserMap.get(data.playerId).BallSocketId)
        .emit('joinRoomBall', id);
    }
  }

  async handleConnection(socket: Socket) {
    const { token } = socket.handshake.auth; // Extract the token from the auth object
    let payload: JwtPayload;
    try {
      if (!token) {
        throw new UnauthorizedException();
      }
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const id: string = payload.userId;
      _User = await this.usersService.findOne({ id });
    } catch {
      console.log('+> not valid token', error);
    }
    if (!_User) return;
    console.log('++> Client', _User.login, 'connected to Game');
    if (!UserMap.has(_User.id))
      UserMap.set(_User.id, {
        User: _User,
        BallSocketId: socket.id,
        Status: 'online',
      });
    else UserMap.get(_User.id).BallSocketId = socket.id;
    if (socket.handshake.auth.tableId) {
      socket.emit('joinRoomBall', socket.handshake.auth.tableId);
    }
  }

  @SubscribeMessage('moveBall')
  MoveBall(client: Socket, data: string) {
    if (TableMap.get(data)) {
      clearInterval(TableMap.get(data).current);
      if (TableMap.get(data).Status) {
        TableMap.get(data).current = setInterval(() => {
          check_col(TableMap.get(data));
          moveBall(this.server, TableMap.get(data));
          if (TableMap.get(data).Status == false) {
            clearInterval(TableMap.get(data).current);
          }
          // increment the ball speed buy changing the interval delay every 10 seconds
          else if (
            TableMap.get(data).time % 1000 &&
            TableMap.get(data).time != 0 &&
            TableMap.get(data).intervaldelay > 14
          ) {
            TableMap.get(data).intervaldelay -= 1;
            clearInterval(TableMap.get(data).current);
            this.server
              .to(data + 'ball')
              .emit('timer', TableMap.get(data).time / 1000);
            this.MoveBall(client, data);
          } else if (
            TableMap.get(data).time % 1000 &&
            TableMap.get(data).time != 0 &&
            TableMap.get(data).intervaldelay == 14
          ) {
            TableMap.get(data).intervaldelay += 1;
            this.server
              .to(data + 'ball')
              .emit('timer', TableMap.get(data).time / 1000);
            clearInterval(TableMap.get(data).current);
            this.MoveBall(client, data);
          }
          TableMap.get(data).time += TableMap.get(data).intervaldelay;
          this.server
            .to(data + 'ball')
            .emit('setBall', TableMap.get(data).ball);
        }, TableMap.get(data).intervaldelay);
      }
    }
  }
  @SubscribeMessage('joinToRoomBall')
  JoinToRoomBall(client: Socket, data: string) {
    client.join(data + 'ball');
  }
}

@Injectable()
@WebSocketGateway({ namespace: 'game' })
class MyGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UserService,
    private GameService: GameService,
    private BallGateway: BallGateway,
  ) {}

  @WebSocketServer()
  server: Server;

  async CreateFriendTable(data: {
    player1Id: string;
    player2Id: string;
    mode: string;
  }) {
    if (!UserMap.has(data.player1Id)) {
      const _User = await this.usersService.findOne({ id: data.player1Id });
      _User && UserMap.set(_User.id, { User: _User, Status: 'online' });
    }
    if (!UserMap.has(data.player2Id)) {
      const _User = await this.usersService.findOne({ id: data.player2Id });
      _User && UserMap.set(_User.id, { User: _User, Status: 'online' });
    }
    if (
      (UserMap.get(data.player1Id) &&
        UserMap.get(data.player1Id).Status == 'inGame') ||
      (UserMap.get(data.player2Id) &&
        UserMap.get(data.player2Id).Status == 'inGame')
    ) {
      return new Error('User already in game');
    } else {
      table_obj.tableId = uuidv4();

      if (
        UserMap.get(data.player1Id) &&
        UserMap.get(data.player2Id) &&
        UserMap.get(data.player1Id).SocketId &&
        UserMap.get(data.player2Id).SocketId &&
        table_obj.tableId
      ) {
        UserMap.get(data.player1Id).User = await this.GameService.updateStatus({
          id: data.player1Id,
          status: 'inGame',
        });
        UserMap.get(data.player2Id).User = await this.GameService.updateStatus({
          id: data.player2Id,
          status: 'inGame',
        });
        UserMap.get(data.player1Id).Status = 'inGame';
        UserMap.get(data.player2Id).Status = 'inGame';
        UserMap.get(data.player1Id).TableId = table_obj.tableId;
        UserMap.get(data.player2Id).TableId = table_obj.tableId;
        const user1 = UserMap.get(data.player1Id).User;
        const user2 = UserMap.get(data.player2Id).User;
        table_obj.GameMode = data.mode;
        table_obj.GameType = 'friend';
        table_obj.player1.setUserId(data.player1Id);
        table_obj.player2.setUserId(data.player2Id);
        table_obj.player1.GameSetting.setData(
          user1.bg_color,
          user1.ball_color,
          user1.paddle_color,
          user1.avatar,
        );
        table_obj.player2.GameSetting.setData(
          user2.bg_color,
          user2.ball_color,
          user2.paddle_color,
          user2.avatar,
        );
        this.server
          .to(UserMap.get(data.player1Id).SocketId)
          .emit('joinRoomGame', table_obj);
        this.server
          .to(UserMap.get(data.player2Id).SocketId)
          .emit('joinRoomGame', table_obj);
        TableMap.set(table_obj.tableId, table_obj);
        this.BallGateway.CreateFriendTable(data, table_obj.tableId);
        table_obj = new TableObj(currents);
      } else {
        setTimeout(() => {
          this.CreateFriendTable(data);
        }, 1000);
      }
    }
  }

  async CreateBotTable(data: { playerId: string; mode: string }) {
    if (!UserMap.has(data.playerId)) {
      const _User = await this.usersService.findOne({ id: data.playerId });
      _User && UserMap.set(_User.id, { User: _User, Status: 'online' });
    }
    if (UserMap.get(data.playerId).Status == 'inGame')
      return new Error('User already in game');
    else {
      if (
        UserMap.get(data.playerId) &&
        UserMap.get(data.playerId).SocketId &&
        UserMap.get(data.playerId).BallSocketId
      ) {
        const user = await this.GameService.updateStatus({
          id: data.playerId,
          status: 'inGame',
        });
        UserMap.get(data.playerId).Status = 'inGame';
        table_obj.tableId = uuidv4();
        UserMap.get(data.playerId).TableId = table_obj.tableId;
        table_obj.GameMode = data.mode;
        table_obj.GameType = 'Bot';
        table_obj.player1.setUserId(data.playerId);
        table_obj.player2.setUserId('Bot');
        table_obj.player1.GameSetting.setData(
          user.bg_color,
          user.ball_color,
          user.paddle_color,
          user.avatar,
        );
        table_obj.player2.GameSetting.setData(
          user.bg_color,
          user.ball_color,
          user.paddle_color,
          '/avatarBot.png',
        );
        this.server
          .to(UserMap.get(data.playerId).SocketId)
          .emit('joinRoomGame', table_obj);
        TableMap.set(table_obj.tableId, table_obj);
        this.BallGateway.CreateBotTable(data, table_obj.tableId);
        table_obj = new TableObj(currents);
        return null;
      } else {
        setTimeout(() => {
          this.CreateBotTable(data);
        }, 1000);
      }
    }
  }

  async CreateRandomTable(data: { playerId: string; mode: string }) {
    if (!UserMap.has(data.playerId)) {
      const _User = await this.usersService.findOne({ id: data.playerId });
      _User && UserMap.set(_User.id, { User: _User, Status: 'online' });
    }
    if (UserMap.get(data.playerId).Status == 'inGame') {
      return new Error('User already in game');
    } else {
      if (
        UserMap.get(data.playerId) &&
        UserMap.get(data.playerId).SocketId &&
        UserMap.get(data.playerId).BallSocketId
      ) {
        const user = await this.GameService.updateStatus({
          id: data.playerId,
          status: 'inGame',
        });
        UserMap.get(data.playerId).Status = 'inGame';
        const obj = new random_obj();
        obj.player.setUserId(data.playerId);
        obj.player.GameSetting.setData(
          user.bg_color,
          user.ball_color,
          user.paddle_color,
          user.avatar,
        );
        if (data.mode === 'time') RandomListTime.add(obj);
        else RandomListScore.add(obj);
        if (RandomListTime.length >= 2 || RandomListScore.length >= 2) {
          table_obj.tableId = uuidv4();
          table_obj.GameType = 'random';
          if (RandomListTime.length >= 2) {
            table_obj.GameMode = 'time';
            table_obj.player1 = RandomListTime.getfirst.player;
            table_obj.player2 = RandomListTime.getfirst.player;
            UserMap.get(table_obj.player1.UserId) &&
              (UserMap.get(table_obj.player1.UserId).TableId =
                table_obj.tableId);
            UserMap.get(table_obj.player2.UserId) &&
              (UserMap.get(table_obj.player2.UserId).TableId =
                table_obj.tableId);
            this.server
              .to(UserMap.get(table_obj.player1.UserId).SocketId)
              .emit('joinRoomGame', table_obj);
            this.server
              .to(UserMap.get(table_obj.player2.UserId).SocketId)
              .emit('joinRoomGame', table_obj);
            TableMap.set(table_obj.tableId, table_obj);
            this.BallGateway.CreateRandomTable(table_obj);
            table_obj = new TableObj(currents);
          } else {
            table_obj.GameMode = 'score';
            table_obj.player1 = RandomListScore.getfirst.player;
            table_obj.player2 = RandomListScore.getfirst.player;
            UserMap.get(table_obj.player1.UserId) &&
              (UserMap.get(table_obj.player1.UserId).TableId =
                table_obj.tableId);
            UserMap.get(table_obj.player2.UserId) &&
              (UserMap.get(table_obj.player2.UserId).TableId =
                table_obj.tableId);
            this.server
              .to(UserMap.get(table_obj.player1.UserId).SocketId)
              .emit('joinRoomGame', table_obj);
            this.server
              .to(UserMap.get(table_obj.player2.UserId).SocketId)
              .emit('joinRoomGame', table_obj);
            TableMap.set(table_obj.tableId, table_obj);
            this.BallGateway.CreateRandomTable(table_obj);
            table_obj = new TableObj(currents);
          }
        }
        return null;
      } else {
        setTimeout(() => {
          this.CreateRandomTable(data);
        }, 1000);
      }
    }
  }

  async LeaveGame(data: { UserId: string; TableId: string }) {
    const leavedUser = data.UserId;
    const table = TableMap.get(data.TableId);
    if (table) {
      await this.GameService.updateStatus({
        id: table.player1.UserId,
        status: 'online',
      });
      if (table.player2.UserId !== 'Bot') {
        await this.GameService.updateStatus({
          id: table.player2.UserId,
          status: 'online',
        });
        if (table.player2.UserId === leavedUser) {
          SetUserMatchNumber(
            this.GameService,
            table.player1.UserId,
            table.player2.UserId,
            1,
          );
        } else {
          SetUserMatchNumber(
            this.GameService,
            table.player2.UserId,
            table.player1.UserId,
            1,
          );
        }
        await this.GameService.CreateScore({
          Player1: table.player1.UserId,
          Player2: table.player2.UserId,
          score1: table.player2.UserId === leavedUser ? 1 : 0,
          score2: table.player2.UserId === leavedUser ? 0 : 1,
        });
      }
      TableMap.get(data.TableId) && (TableMap.get(data.TableId).Status = false);
      this.server.to(table.tableId).emit('setStatus', false);
      UserMap.get(data.UserId) &&
        this.server
          .to(table.tableId)
          .emit('leaveGame', UserMap.get(data.UserId).SocketId);
    }
  }

  async handleConnection(socket: Socket) {
    const { token } = socket.handshake.auth; // Extract the token from the auth object
    let payload: JwtPayload;
    try {
      if (!token) {
        throw new UnauthorizedException();
      }
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const id: string = payload.userId;
      _User = await this.usersService.findOne({ id });
    } catch {
      console.log('+> not valid token', error);
    }
    if (!_User) return;
    if (!UserMap.has(_User.id))
      UserMap.set(_User.id, {
        User: _User,
        SocketId: socket.id,
        Status: 'online',
      });
    else {
      UserMap.get(_User.id).SocketId = socket.id;
      clearTimeout(UserMap.get(_User.id).timeOut);
      UserMap.get(_User.id).timeOut = null;
    }
    if (socket.handshake.auth.tableId) {
      socket.emit('joinRoomGame', TableMap.get(socket.handshake.auth.tableId));
    }
  }

  @SubscribeMessage('joinToRoomGame')
  JoinToRoomGame(client: Socket, data: string) {
    client.join(data);
    this.server.to(data).emit('ready', true);
  }

  @SubscribeMessage('setPlayer1')
  SetPlayer1(client: Socket, data: { tableId: string; Player: number }) {
    if (
      TableMap.get(data.tableId) &&
      TableMap.get(data.tableId).player1.position != data.Player
    ) {
      TableMap.get(data.tableId).player1.position = data.Player;
      this.server.to(data.tableId).emit('setPlayer1', data.Player);
    }
  }

  @SubscribeMessage('disconnecting')
  async disconneting(client: Socket, data: string[]) {
    const UsId = client.handshake.auth.UserId;
    const TableId = UserMap.get(UsId) && UserMap.get(UsId).TableId;
    if (data[0] == 'transport close') {
      console.log(
        '--> Client',
        UserMap.get(UsId).User.login,
        'reload the game page',
      );
      if (
        UserMap.get(UsId) &&
        UserMap.get(UsId).TableId &&
        TableMap.get(UserMap.get(UsId).TableId)
      ) {
        TableMap.get(TableId).Status = false;
        this.server.to(TableId).emit('setStatus', false);
        UserMap.get(UsId).timeOut = setTimeout(async () => {
          console.log(
            '--> Client',
            UserMap.get(UsId).User.login,
            'logout from the game page',
          );
          await this.GameService.updateStatus({ id: UsId, status: 'online' });
          if (UserMap.get(UsId)) {
            this.server.to(TableId).emit('leaveGame');
            if (
              UserMap.get(UsId).TableId &&
              TableMap.get(UserMap.get(UsId).TableId)
            ) {
              clearInterval(TableMap.get(UserMap.get(UsId).TableId).current);
              TableMap.delete(UserMap.get(UsId).TableId);
            }
            RandomListScore.deleteElement(UsId);
            RandomListTime.deleteElement(UsId);
            UserMap.delete(UsId);
          }
        }, 10000);
      }
    } else {
      console.log('--> Client', UsId, 'logout from the game page');
      await this.GameService.updateStatus({ id: UsId, status: 'online' });
      if (UserMap.get(UsId)) {
        this.server.to(TableId).emit('leaveGame');
        if (
          UserMap.get(UsId).TableId &&
          TableMap.get(UserMap.get(UsId).TableId)
        ) {
          clearInterval(TableMap.get(UserMap.get(UsId).TableId).current);
          TableMap.delete(UserMap.get(UsId).TableId);
        }
        RandomListScore.deleteElement(UsId);
        RandomListTime.deleteElement(UsId);
        UserMap.delete(UsId);
      }
    }
  }
  @SubscribeMessage('deletePlayer')
  async DeletePlayer(client: Socket) {
    let type: string = '';
    if (UserMap.get(client.handshake.auth.UserId)) {
      const tableId = UserMap.get(client.handshake.auth.UserId).TableId;
      if (
        TableMap.get(tableId) &&
        TableMap.get(tableId).player1 &&
        TableMap.get(tableId).player2
      ) {
        const player1 = TableMap.get(tableId).player1;
        const player2 = TableMap.get(tableId).player2;
        if (
          UserMap.get(player1.UserId) &&
          UserMap.get(player1.UserId).TableId &&
          TableMap.get(UserMap.get(player1.UserId).TableId)
        ) {
          clearInterval(
            TableMap.get(UserMap.get(player1.UserId).TableId).current,
          );
          type = TableMap.get(UserMap.get(player1.UserId).TableId).GameType;
          UserMap.get(player1.UserId) &&
            TableMap.delete(UserMap.get(player1.UserId).TableId);
          UserMap.delete(player1.UserId);
          await this.GameService.updateStatus({
            id: player1.UserId,
            status: 'online',
          });
          if (type != 'Bot')
            await this.GameService.CreateScore({
              Player1: player1.UserId,
              Player2: player2.UserId,
              score1: player1.score,
              score2: player2.score,
            });
        }
        if (UserMap.get(player2.UserId)) {
          UserMap.delete(player2.UserId);
          await this.GameService.updateStatus({
            id: player2.UserId,
            status: 'online',
          });
        }
      }
    }
  }
  @SubscribeMessage('setPlayer2')
  SetPlayer2(client: Socket, data: { tableId: string; Player: number }) {
    if (
      TableMap.get(data.tableId) &&
      TableMap.get(data.tableId).player2.position != data.Player
    ) {
      TableMap.get(data.tableId).player2.position = data.Player;
      this.server.to(data.tableId).emit('setPlayer2', data.Player);
    }
  }

  @SubscribeMessage('setBot')
  SetBot(client: Socket, data: { tableId: string; Player: number }) {
    if (
      TableMap.get(data.tableId) &&
      TableMap.get(data.tableId).player2.position != data.Player
    )
      TableMap.get(data.tableId).player2.position = data.Player;
  }

  @SubscribeMessage('setStatus')
  SetStatus(client: Socket, data: { tableId: string; status: boolean }) {
    if (
      TableMap.get(data.tableId) &&
      TableMap.get(data.tableId).Status != data.status
    ) {
      const table = TableMap.get(data.tableId);
      table && (table.Status = data.status);
      this.server.to(data.tableId).emit('setStatus', data.status);
    }
  }

  @SubscribeMessage('GameOver')
  GameOver(client: Socket, data: { tableId: string }) {
    if (TableMap.get(data.tableId)) {
      const player1 = TableMap.get(data.tableId).player1.UserId;
      const player2 = TableMap.get(data.tableId).player2.UserId;
      const score1 = TableMap.get(data.tableId).player1.score;
      const score2 = TableMap.get(data.tableId).player2.score;
      score2 == 0 &&
        player2 != 'Bot' &&
        setcleanSheet(this.GameService, player1);
      score1 == 0 &&
        player2 != 'Bot' &&
        setcleanSheet(this.GameService, player2);
      let winner = score1 > score2 ? player1 : player2;
      winner = score1 == score2 ? 'no one' : winner;
      if (winner != 'no one') {
        score1 > score2
          ? SetUserMatchNumber(
              this.GameService,
              player1,
              player2,
              score1 - score2,
            )
          : SetUserMatchNumber(
              this.GameService,
              player2,
              player1,
              score2 - score1,
            );
      } else {
        setUserDraw(this.GameService, player1, player2);
      }
      this.server.to(data.tableId).emit('GameOver', winner);
    }
  }
}

export { BallGateway, MyGateway };
