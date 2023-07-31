import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOneLogin({ login: username });
    // console.log('signIn(username: string, pass: string) user:', user);
    if (user && user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.login };
    // console.log('signIn(username: string, pass: string) payload:', payload);

    const _token = await this.jwtService.signAsync(payload);
    // console.log('signIn(username: string, pass: string) _token:', _token);

    return {
      access_token: _token,
      _id: user.id,
    };
  }
}
