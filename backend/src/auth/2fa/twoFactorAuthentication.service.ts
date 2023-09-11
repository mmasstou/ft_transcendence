import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { Prisma } from '@prisma/client';
import { UserService } from 'src/users/user.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  public async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: Prisma.UserUncheckedCreateInput,
  ) {
    const _user = await this.usersService.findOne({ id: user.id });
    if (!_user || !twoFactorAuthenticationCode) return false;

    try {
      const isCodeValid = authenticator.verify({
        token: twoFactorAuthenticationCode,
        secret: _user.twoFactorAuthenticationSecret,
      });
      return isCodeValid;
    } catch (err) {
      return false;
    }
  }

  public async generateTwoFactorAuthenticationSecret(
    user: Prisma.UserUncheckedCreateInput,
  ) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get(process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME),
      secret,
    );

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async isSecondFactorAuthenticated(id: string, status: boolean) {
    return await this.prisma.user.update({
      where: { id },
      data: { isSecondFactorAuthenticated: status },
    });
  }
}
