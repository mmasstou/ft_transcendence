import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    let payload: any = '';
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    const User = await this.usersService.findOne({ login: payload.username });
    if (User && !User.is_active) throw new ForbiddenException();

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    console.log('++++++++>request :', request);
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log('request.headers.type :', type);
    console.log('request.headers.token :', token);
    return type === 'Bearer' ? token : undefined;
  }
}
