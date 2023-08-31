import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UserService } from './users/user.service';
import { error } from 'console';
@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}
  async handleSocketConnection(socket: Socket): Promise<boolean> {
    const { token } = socket.handshake.auth; // Extract the token from the auth object
    let payload: any = '';
    try {
      if (!token) {
        return false;
      }
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return true;
      // console server socket id :
    } catch {
      console.log('Chat-handleSocketConnection> error- 2+>', error);
      return false;
    }
  }
}
