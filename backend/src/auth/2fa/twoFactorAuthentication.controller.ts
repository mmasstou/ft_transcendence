import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
  HttpCode,
  Body,
  Get,
  HttpException,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-oauth.guard';
import RequestWithUser from '../requestWithUser.interface';
import { UserService } from 'src/users/user.service';
import { TwoFactorAuthenticationCodeDto } from 'src/Dtos/TwoFactorAuthenticationCodeDto';
import { AuthService } from '../auth.service';

@Controller('/2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UserService,
    private readonly authService: AuthService,
    private readonly TwoFactorAuthenticationService: TwoFactorAuthenticationService,
  ) {}

  @Post('/authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user,
      );

    if (!isCodeValid) {
      throw new HttpException('Wrong authentication code', 401);
    }

    const accessTokenData = await this.authService.generateJwt(request.user);
    const accessTokenCookie = accessTokenData.accessToken;
    request.res.setHeader('Set-Cookie', [accessTokenCookie]);
    // update isTwoFactorAuthenticationEnabled to true
    await this.TwoFactorAuthenticationService.isSecondFactorAuthenticated(
      request.user.id,
      false,
    );

    return request.user;
  }

  @Post('/turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user,
      );
    if (!isCodeValid) {
      throw new HttpException('Wrong authentication code', 401);
    }
    await this.TwoFactorAuthenticationService.isSecondFactorAuthenticated(
      request.user.id,
      true,
    );
    await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
  }

  @Post('/turn-off')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOffTwoFactorAuthentication(@Req() request: RequestWithUser) {
    await this.usersService.turnOffTwoFactorAuthentication(request.user.id);
    await this.TwoFactorAuthenticationService.isSecondFactorAuthenticated(
      request.user.id,
      false,
    );
  }

  @Get('/generate')
  @UseGuards(JwtAuthGuard)
  async register(
    @Res() response: Response | any,
    @Req() request: RequestWithUser,
  ) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUrl,
    );
  }
}
