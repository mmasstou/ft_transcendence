import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class DmGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DmGateway.name);

  afterInit(server: Server) {
    this.logger.debug('marbenMB : DmGateway server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`marbenMB : Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`marbenMB : Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    this.server.emit('message', payload);
    this.logger.log(client.id, payload);
  }
}