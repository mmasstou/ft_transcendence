import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-oauth.guard';
import { UserService } from 'src/users/user.service';
import { PrismaService } from 'src/prisma.service';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // signIn(@Body() signInDto: Record<string, any>) {
  //   console.log('Login Data :', signInDto);
  //   return this.authService.signIn(signInDto.username, signInDto.password);
  // }

  // @UseGuards(AuthGuard('42'))
  @Get('42')
  async login42(@Req() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard('42'))
  @Get('callback')
  async IntraAuthCallback(@Req() req: any, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(req.user);
      const { accessToken } = result;
      res.cookie('token', accessToken, {
        httpOnly: false,
        sameSite: false,
      });
      res.cookie('_id', req.user.id, {
        httpOnly: false,
        sameSite: false,
      });
      if (req.user.logedFirstTime) {
        return res.redirect(`${process.env.AUTH_REDIRECT_LOGIN}`);
      }
      if (req.user.twoFA) {
        return res.redirect(`${process.env.AUTH_REDIRECT_2FA}`);
      } else {
        return res.redirect(`${process.env.AUTH_REDIRECT_URI}`);
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res() res: Response): Promise<any> {
    await this.prisma.user.update({
      where: { email: req.user.email },
      data: {
        logedFirstTime: false,
      },
    });
    // res.clearCookie('token');
    // res.clearCookie('accessToken');
    // res.clearCookie('_id');
    res.sendStatus(200);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async status(@Req() req: any) {
    const _user = await this.userService.findOneLogin({
      login: req.user.login,
    });
    return _user;
  }
}
