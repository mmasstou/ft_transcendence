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
    // const user: User = {
    //   login: profile._json.login,
    //   email: profile._json.email,
    //   avatar: profile._json.image.link,
    //   name: profile._json.usual_full_name,
    //   banner: '',
    //   intraId: profile._json.id,
    // };
    const _UserExist = await this.prisma.user.findUnique({
      where: { login: profile._json.login },
    });
    if (!_UserExist) {
      console.log('+++++++IntraStrategy-> :', profile._json);
      const _User = await this.prisma.user.create({
        data: {
          login: profile._json.login,
          email: profile._json.email,
          avatar: profile._json.image.link,
          name: profile._json.usual_full_name,
          banner: '',
          intraId: profile._json.id,
        },
      });
      console.log('+++++++IntraStrategy-> :', _User);
      console.log('+++profile++++IntraStrategy-> :', profile._json.login);
      done(null, _User);
    } else done(null, _UserExist);
  }
}
