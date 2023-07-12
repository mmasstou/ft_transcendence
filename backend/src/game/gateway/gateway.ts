import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import {Player, Ball} from 'G_Class/class';

// var player = new Player();

let table_obj = {
    player1: new Player(),
    Player2: new Player(),
    ball: new Ball(),
    id1: '',
    id2: '',
    // player2: new Player(),
    // ball: new Ball(),
}

@WebSocketGateway()
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log('connected', socket.id);
            if (table_obj.id1 == '') {
                table_obj.id1 = socket.id;
                // console.log('table_obj.id1 :', table_obj.id1);
                this.server.emit('update', {table_obj});
            }
            else if (table_obj.id2 == '') {
                table_obj.id2 = socket.id;
                // console.log('table_obj.id2 :', table_obj.id2);
                this.server.emit('update', {table_obj});
            }
            else {
                table_obj.id1 = socket.id;
                table_obj.id2 = '';
                this.server.emit('update', {table_obj});
            }
        });
        this.server.on('disconnect', (socket) => {
            console.log('disconnected', socket.id);
        });
    }
    
    @SubscribeMessage('message')
    onMessage(@MessageBody() body: any) {
        console.log(body);
        this.server.emit('message', {titile: 'new message from the server', content: body});
        // this.server.to(body.room).emit('message', {titile: 'new message from the server', content: body})
    }
}
// /app/dist/src/game/gateway/gateway.js

