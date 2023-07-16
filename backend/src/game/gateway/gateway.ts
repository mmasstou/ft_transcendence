// import { useRef } from "react";
import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import {Player, Ball, ballSpeed} from 'G_Class/class';
import e from "express";
// import { useRef } from "react";

// var player = new Player();

var table_obj = {
    player1: new Player(),
    player2: new Player(),
    ball_speed: new ballSpeed(),
    SizeCanvas: ({width:0, height:0}),
    id1: '',
    id2: '',
    ball: new Ball(),
    Status: false,
}
var current: NodeJS.Timeout;
// const intervalRef = useRef<number>(0);

function check_col(){
    var is_vertical = table_obj.SizeCanvas.height > table_obj.SizeCanvas.width ? true : false;
    var player_width = is_vertical ? (table_obj.SizeCanvas.width / 10) : (table_obj.SizeCanvas.height / 10);
    var player_height = is_vertical ? ((table_obj.SizeCanvas.height / 90) + (table_obj.SizeCanvas.height / 45)) : ((table_obj.SizeCanvas.width / 90) + (table_obj.SizeCanvas.width / 45));
    var player1 = is_vertical ? ((table_obj.SizeCanvas.width * table_obj.player1.position) / 100) : (table_obj.SizeCanvas.height * table_obj.player1.position) / 100;
    var player2 = is_vertical ? ((table_obj.SizeCanvas.width * table_obj.player2.position) / 100) : ((table_obj.SizeCanvas.height * table_obj.player2.position) / 100);
    var ball_x = is_vertical ? ((table_obj.SizeCanvas.width * table_obj.ball.y) / 100) : ((table_obj.SizeCanvas.width * table_obj.ball.x) / 100);
    var ball_y = is_vertical ? ((table_obj.SizeCanvas.height * table_obj.ball.x) / 100) : (table_obj.SizeCanvas.height * table_obj.ball.y) / 100;
    var ball_rad = (table_obj.SizeCanvas.width + table_obj.SizeCanvas.height) / 120;
    // console.log("player1 ", player1,"player2", player2, "ball_x", ball_x, "ball_y", ball_y, "ball_rad", ball_rad, "player_width", player_width, "player_height",player_height, "is_vertical", is_vertical);

    // console.log(player1, " - ", player2, " -- ", ball_x, ball_y);


    if (!is_vertical && ((ball_y + ball_rad) >= table_obj.SizeCanvas.height || ball_y - ball_rad <= 0)) //// colleg with wall H
        table_obj.ball_speed.y = -table_obj.ball_speed.y;
    else if (is_vertical && (((ball_x + ball_rad) >= table_obj.SizeCanvas.width) || (ball_x - ball_rad) <= 0)) //// colleg with wall V
        table_obj.ball_speed.y = -table_obj.ball_speed.y;
    else if (is_vertical && (((table_obj.SizeCanvas.height * 44/45) - ball_y) < (ball_rad + table_obj.SizeCanvas.height / 90)) && ((ball_x - player2 - player_width) >= 0 || (ball_x - player1) > 0)) {
        // console.log((ball_x - ball_rad) - player1, (ball_x - ball_rad), player1);
        table_obj.ball_speed.x = -table_obj.ball_speed.x;
    }

    // else if (is_vertical && (((ball_y + ball_rad) - player_height) > 0 ) && (ball_x + ball_rad) < player1 + player_width) {  ////// player 1 V
    //     // console.log(ball_y);
    //     table_obj.ball_speed.x = -table_obj.ball_speed.x;

    
    // }


    // else if (is_vertical && ((ball_y + ball_rad + player_height) > table_obj.SizeCanvas.height) && (ball_x + ball_rad) < player1 + player_width) {  ////// player 1 V
    //     console.log(ball_y);
    //     table_obj.ball_speed.x = -table_obj.ball_speed.x;
    // }
    // else if (is_vertical && ((ball_y - (ball_rad + player_height)) < 0) && ball_x > player1 && (ball_x < player1 + player_width)) { //// player 2 V
    //     // console.log("col V");
    //     table_obj.ball_speed.x = -table_obj.ball_speed.x;
    //     // table_obj.ball_speed.x += table_obj.ball_speed.x > 0 ? 0.05 : -0.05
    //     // table_obj.ball_speed.y += table_obj.ball_speed.y > 0 ? 0.05 : -0.05
    // }
    // else if (!is_vertical && (ball_x - (ball_rad + player_height + table_obj.SizeCanvas.width / 45) < 0) && (ball_y) > player2 && (ball_y < player2 + player_width)) { ////// player 2 H
    //     table_obj.ball_speed.x = -table_obj.ball_speed.x;
    //     // table_obj.ball_speed.x += table_obj.ball_speed.x > 0 ? 0.05 : -0.05
    //     // table_obj.ball_speed.y += table_obj.ball_speed.y > 0 ? 0.05 : -0.05
    // }
    // else if (!is_vertical && (ball_x + (ball_rad + player_height + table_obj.SizeCanvas.width / 45) > table_obj.SizeCanvas.width) && ball_y > player1 && ball_y < player1 + player_width) { //////// player 1 H
    //     table_obj.ball_speed.x = -table_obj.ball_speed.x;
    //     // table_obj.ball_speed.x += table_obj.ball_speed.x > 0 ? 0.05 : -0.05
    //     // table_obj.ball_speed.y += table_obj.ball_speed.y > 0 ? 0.05 : -0.05
    // }
    // // return ball_speed
}

function moveBall(){
    // BallObj: { x: number; y: number; },
    // canvas: HTMLCanvasElement | null,
    // ball_speed: { x: number; y: number; }) {
        // if (!canvas || !ball_speed)
        //     return BallObj
    var is_vertical = table_obj.SizeCanvas.height > table_obj.SizeCanvas.width ? true : false;
    // var ballPos = {
    //   x:table_obj.ball.x,
    //   y:table_obj.ball.y
    // }
    if (is_vertical && table_obj.ball.x > 0 && table_obj.ball.x < 100 && table_obj.ball.y > 0 && table_obj.ball.y < 100) {
      table_obj.ball.x += table_obj.ball_speed.x;
      table_obj.ball.y += table_obj.ball_speed.y;
    }
    else if (!is_vertical && table_obj.ball.x >= 0 && table_obj.ball.x <= 100 && table_obj.ball.y >= 0 && table_obj.ball.y <= 100) {
      table_obj.ball.x += table_obj.ball_speed.x;
      table_obj.ball.y += table_obj.ball_speed.y;
    }
    else {
      table_obj.ball_speed.x = -table_obj.ball_speed.x;
      table_obj.ball_speed.y = -table_obj.ball_speed.y;
    //   table_obj.ball_speed.x -= table_obj.ball_speed.x > 0.2 ? 0.1 : -0.1
    //   table_obj.ball_speed.y -= table_obj.ball_speed.y > -0.2 ? 0.1 : -0.1
      table_obj.ball.x = 50;
    //   table_obj.ball.y = 50;
    }
    // return ballPos;
  }
 
@WebSocketGateway()
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    
    onModuleInit() {
        this.server.on('connection', (socket) => {
            socket.on('disconnect', () => {
                if (table_obj.id1 == socket.id) {
                    table_obj.id1 = '';}
                else if (table_obj.id2 == socket.id) {
                    table_obj.id2 = '';
                }
                socket.disconnect();
                console.log('disconnected', socket.id);
            });
            console.log('connected', socket.id);
            if (table_obj.id1 == '') {
                table_obj.id1 = socket.id;
                // console.log('table_obj.id1 :', table_obj.id1);
                this.server.emit('update', table_obj);
            }
            else if (table_obj.id2 == '') {
                table_obj.id2 = socket.id;
                // console.log('table_obj.id2 :', table_obj.id2);
                this.server.emit('update', table_obj);
            }
            else {

                table_obj.id1 = socket.id;
                table_obj.id2 = '';
                this.server.emit('update', table_obj);
            }
            // console.log("id1: ", table_obj.id1, "id2: ", table_obj.id2)
        });
    }
    
    @SubscribeMessage('moveBall')
    MoveBall() {
        clearInterval(current);
        if (table_obj.Status) {
            current = setInterval(() => {
                check_col();
                moveBall();
                this.server.emit('setBall', table_obj.ball);
            }, 15);
        }
    }

    @SubscribeMessage('setPlayer1')
    SetPlayer1(client: any, data: any) {
        table_obj.player1.position = data;
        this.server.emit('update', table_obj);
        this.server.emit('setPlayer1', data);
        // this.server.to(body.room).emit('message', {titile: 'new message from the server', content: body})
    }

    @SubscribeMessage('setPlayer2')
    SetPlayer2(client: any, data: any) {
        table_obj.player2.position = data;
        this.server.emit('update', table_obj);
        this.server.emit('setPlayer2', data);
    }

    @SubscribeMessage('setBall')
    SetBall(client: any, data: any) {
        // console.log('data :', data);
        table_obj.ball = data;
        // this.server.emit('update', table_obj);
        this.server.emit('setBall', data);
    }
    
    @SubscribeMessage('setStatus')
    SetStatus(client:any, data: boolean) {
        table_obj.Status = data;
        // console.log(data, table_obj);
    }

    @SubscribeMessage('setSize')
    SetSize(client:any, data: any) {
        table_obj.SizeCanvas = data;
    }
}
// /app/dist/src/game/gateway/gateway.js

