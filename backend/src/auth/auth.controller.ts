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
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
      console.log('signIn -- IntraAuthCallback-> :', result);
      const { accessToken } = result;
      console.log('result-> :', result);
      res.cookie('token', accessToken, {
        httpOnly: false,
        sameSite: false,
      });
      res.cookie('_id', req.user.id, {
        httpOnly: false,
        sameSite: false,
      });
      res.redirect(`${process.env.AUTH_REDIRECT_URI}`);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  // @Get('logout')
  // @UseGuards(JwtAuthGuard)
  // async logout(@Req() req: any, @Res() res: Response): Promise<any> {
  //   res.clearCookie('access_token');
  //   await this.authService.logout(req.user.login);
  //   res.sendStatus(200);
  // }

  @Get('status')
  // @UseGuards(JwtAuthGuard)
  status(@Req() req: any) {
    return req.user;
  }
}
