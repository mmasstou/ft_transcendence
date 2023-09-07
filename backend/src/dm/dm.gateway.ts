import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { UserService } from 'src/users/user.service';
import { DmService } from './dm.service';
import { Messages, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
@Injectable()
@WebSocketGateway({ namespace: 'dm' })
export class DmGateway implements OnGatewayConnection {
  constructor(
    private readonly usersService: UserService,
    private messageservice: MessagesService,
    private dmService: DmService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const User: User = await this.usersService.getUserInClientSocket(socket);
    if (!User) {
      console.log('handleConnection -> User not exist');
      socket.emit('removeToken', null);
    }
    if (User) {
      if (!this.dmService.connectToALLDm(User, socket)) {
        console.log('handleConnection -> error');
      }
      this.server.emit('ref', { socketId: socket.id });
      socket.emit('offline-connection');
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: {
      content: string;
      senderId: string;
      dmId: string;
    },
  ) {
    try {
      const md = await this.dmService.findOne(payload.dmId);

      if (!md) throw new Error('Dm not found');
      const User = await this.usersService.findOne({ id: payload.senderId });
      if (!User) throw new Error('User not found');
      const message: Messages = await this.messageservice.create({
        DirectMessage: md.id,
        content: payload.content,
        userId: User.id,
      });

      this.server.to(md.id).emit('message', message);
    } catch (error) {
      console.log('DmGateway -> handleMessage -> error', error.message);
    }
  }

  @SubscribeMessage('createDm')
  async handleCreateDm(payload: { senderId: string; receiverId: string }) {
    try {
      this.server.emit('createDm', payload);
    } catch (error) {
      console.log('DmGateway -> handleCreateDm -> error', error.message);
    }
  }

  @SubscribeMessage('accessToDm')
  async handleAccessToDm(
    client: Socket,
    payload: { senderId: string; receiverId: string },
  ) {
    try {
      const dm = await this.dmService.findDmBetweenTwoUsers(
        payload.senderId,
        payload.receiverId,
      );
      client.join(dm.id);
    } catch (error) {
      console.log('DmGateway -> handleAccessToDm -> error', error.message);
    }
  }

  @SubscribeMessage('deleteDm')
  async handleRemoveDm(payload: { senderId: string; receiverId: string }) {
    try {
      const dm = await this.dmService.findDmBetweenTwoUsers(
        payload.senderId,
        payload.receiverId,
      );
      if (!dm) throw new Error('Dm not found');
      await this.dmService.delete(dm.id);
      this.server.emit('deleteDm', payload);
    } catch (error) {
      console.log('DmGateway -> handleRemoveDm -> error', error.message);
    }
  }
}
