import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback, Strategy } from 'passport-42';
import { User } from '@prisma/client';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
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
    done: VerifyCallback,
  ): Promise<any> {
    const _UserExist = await this.prisma.user.findUnique({
      where: { login: profile._json.login },
    });
    if (!_UserExist) {
      const cursus_users = await this.prisma.cursus.create({
        data: {
          grade: profile._json.cursus_users[1].grade,
          level: profile._json.cursus_users[1].level,
          blackholed_at: profile._json.cursus_users[1].blackholed_at,
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
          cursus_users: {
            connect: {
              id: cursus_users.id,
            },
          },
        },
      });
      done(null, _User);
    } else {
      done(null, _UserExist);
    }
  }
}
