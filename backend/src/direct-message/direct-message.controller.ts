import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('direct-message')
export class DirectMessageController {
  constructor(private readonly directMessage: DirectMessageService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directMessage.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body('receiverId') receiverId: string, @Req() request: Request) {
    const User_payload: any = request.user;
    const userId: any = User_payload.sub;
    return this.directMessage.create({ receiverId, userId });
  }

  @UseGuards(AuthGuard)
  @Get('messages/:directMessageId')
  getMessaages(@Param('directMessageId') id: string) {
    return this.directMessage.getMessaages({ id });
  }
}
