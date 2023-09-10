import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';
import { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URI,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, name, emails, photos, login, location, intraId, kind } =
      profile;

    if (!login && !location && !intraId && !kind) {
      const newLogin: string = generateRandomUsername(
        profile._json.given_name,
        profile._json.family_name,
      );
      profile._json.login = newLogin;
      profile._json.location = 'Unavailable';
      profile._json.intraId = null;
      profile._json.kind = 'google';
    }

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
            profile._json.given_name,
            profile._json.family_name,
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

      const newUser = await this.prisma.user.create({
        data: {
          login: profile._json.login,
          email: profile._json.email,
          avatar: profile._json.picture,
          name: `${profile._json.given_name} ${profile._json.family_name}`,
          banner: '',
          kind: profile._json.kind,
          intraId: null,
          location: profile._json.location,
          logedFirstTime: true,
        },
      });

      return newUser;
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
