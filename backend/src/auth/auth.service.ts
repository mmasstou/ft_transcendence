import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(user: Prisma.UserUncheckedCreateInput) {
    // if (!user) {
    //   throw new BadRequestException('Unauthenticated');
    // }

    const userExists = await this.usersService.findOneLogin({
      login: user.login,
    });

    if (!userExists) {
      console.log('************** user not exists **************');
      return await this.registerUser(user);
    }
    return this.generateJwt({
      login: userExists.login,
      email: userExists.email,
      avatar: userExists.avatar,
      name: userExists.name,
      banner: userExists.banner,
      intraId: userExists.intraId,
      logedFirstTime: userExists.logedFirstTime,
    });
  }
  async registerUser(user: Prisma.UserUncheckedCreateInput) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          login: user.login,
          email: user.email,
          avatar: user.avatar,
          name: user.name,
          banner: user.banner,
          intraId: user.intraId,
          logedFirstTime: user.logedFirstTime,
        },
      });
      return await this.generateJwt({
        login: newUser.login,
        email: newUser.email,
        avatar: newUser.avatar,
        name: newUser.name,
        banner: newUser.banner,
        intraId: newUser.intraId,
        logedFirstTime: newUser.logedFirstTime,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async generateJwt(payload: any) {
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
