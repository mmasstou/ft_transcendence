import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway(3000, { namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string): void {
    console.log('message :', data);
    this.server.emit('message', data);
  }
}
