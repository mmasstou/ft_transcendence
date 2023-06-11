import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  handleEvent(@MessageBody() data: any): void {
    console.log('+++++++++++++++++++|> message :', data);
    this.server.emit('message', 'message from the server');
  }
}
