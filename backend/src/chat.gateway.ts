import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthGuard } from './auth/auth.guard';
import { Req, UseGuards } from '@nestjs/common';
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(AuthGuard)
  @SubscribeMessage('sendMessage')
  handleEvent(@MessageBody() data: string, @Req() request: any): void {
    console.log('message :', data);
    console.log('request :', request.user);
    this.server.emit('message', 'message from the server');
  }
}
