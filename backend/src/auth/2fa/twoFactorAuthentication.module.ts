import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { UserService } from 'src/users/user.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Module({
  providers: [
    TwoFactorAuthenticationService,
    UserService,
    PrismaService,
    ConfigService,
    AuthService,
  ],
  controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
