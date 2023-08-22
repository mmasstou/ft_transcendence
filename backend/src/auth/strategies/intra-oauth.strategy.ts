import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from 'src/prisma.service';
import { _User } from 'src/chat.gateway';
import { UserService } from 'src/users/user.service';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: process.env.INTRA_UID,
      clientSecret: process.env.INTRA_SECRET,
      callbackURL: process.env.INTRA_CALLBACK_URI,
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const _UserExist = await this.prisma.user.findUnique({
      where: { email: profile._json.email },
    });

    if (!_UserExist) {
      const loginExist = await this.userService.findOneLogin({
        login: profile._json.login,
      });

      if (loginExist) {
        while (true) {
          const newLogin: string = generateRandomUsername(
            profile._json.first_name,
            profile._json.last_name,
          );
          const loginExist = await this.userService.findOneLogin({
            login: newLogin,
          });
          if (newLogin !== loginExist?.login) {
            profile._json.login = newLogin;
            break;
          }
        }
      }

      const cursus_users = await this.prisma.cursus.create({
        data: {
          grade: profile._json.cursus_users[1].grade,
          level: profile._json.cursus_users[1].level,
        },
      });
      const _User = await this.prisma.user.create({
        data: {
          login: profile._json.login,
          email: profile._json.email,
          avatar: profile._json.image.link,
          name: profile._json.usual_full_name,
          banner: '',
          kind: profile._json.kind,
          intraId: profile._json.id,
          location: profile._json.location,
          logedFirstTime: true,
          cursus_users: {
            connect: {
              id: cursus_users.id,
            },
          },
        },
      });
      return _User;
    } else if (_UserExist.logedFirstTime == true) {
      await this.prisma.user.update({
        where: { email: profile._json.email },
        data: {
          logedFirstTime: false,
        },
      });
      return _UserExist;
    }
    return _UserExist;
  }
}

function generateRandomUsername(firstName: string, lastName: string) {
  const maxUsernameLength = 8;
  const randomNum = Math.floor(Math.random() * 99); // Generate a random number between 0 and 99

  const username = (
    firstName.slice(0, Math.min(2, firstName.length)) +
    lastName.slice(0, 4) +
    randomNum
  ).toLowerCase();

  return username.slice(0, maxUsernameLength);
}
