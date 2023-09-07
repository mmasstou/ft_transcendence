import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server } from 'socket.io';
import { clientOnLigne } from 'src/users/user.gateway';
import { UserService } from 'src/users/user.service';

@WebSocketGateway({
  namespace: 'notifications',
})
export class NotificationsGateway {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Notification Gateway Initialized');
  }

  // send notification to userId with message
  @SubscribeMessage('notification')
  async sendNotification(userId: string, message: string) {
    try {
      const UserTOSendTo: User | null = await this.userService.findOne({
        id: userId,
      });

      if (!UserTOSendTo) return;

      if (UserTOSendTo) {
        const receiverSocket = clientOnLigne.get(UserTOSendTo?.id);
        if (receiverSocket) {
          receiverSocket.forEach((socket) => {
            console.log(socket.id);
            socket.emit('notification', message);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
