import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';
import { DmService } from './dm.service';
import { Request } from 'express';
@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() request: Request) {
    const userIds: any = request.user;
    const login: string = userIds.login;
    return this.dmService.findAll(login);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dmService.findOne(id);
  }
}
