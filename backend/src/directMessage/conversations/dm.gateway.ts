import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages/messages.service';

interface frontMsg {
  conversationId: string,
  senderId: string,
  content: string,
}

@WebSocketGateway()
export class DmGateway implements OnGatewayInit {
  
  constructor(private readonly messageService: MessagesService) {}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DmGateway.name);

  afterInit(server: Server) {
    this.logger.debug('marbenMB : DmGateway server initialized');
  }

  handleConnection(client: Socket) {
    const { id: userId } = client.handshake.auth;
    this.logger.debug(`marbenMB : Client ${client.id} connected`);
    this.logger.debug(`marbenMB : ConvId : ${userId}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`marbenMB : Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: frontMsg): Promise<void> {
    const msg = await this.messageService.newMessage(payload.senderId, payload.content, payload.conversationId);
    this.logger.log(client.id, payload);
    this.logger.log(msg);
    this.server.emit('message', msg);

  }
}