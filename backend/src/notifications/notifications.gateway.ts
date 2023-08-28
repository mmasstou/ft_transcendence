import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'notifications',
})
export class NotificationsGateway {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Notification Gateway Initialized');
  }

  sendNotification(userId: string, message: string): void {
    console.log(`${userId} : ${message}`);
    this.server.emit('notification', message);
  }
}
