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
<<<<<<< HEAD
    if (user && user?.password !== pass) {
=======
    if (user?.password !== pass) {
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.login };
    return {
      access_token: await this.jwtService.signAsync(payload),
      _id: user.id,
    };
  }
}
