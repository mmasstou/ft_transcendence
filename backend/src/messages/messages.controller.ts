import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body() data: { content: string; roomId: string },
  ) {
    const User: any = request.user;
    const userId = User.sub;
    return this.messageService.create({
      content: data.content,
      roomId: data.roomId,
      userId: userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('channeL/:id')
  findALLForChanneL(@Param('id') id: string) {
    return this.messageService.findALLForChanneL(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('all/:roomId')
  removeALL(@Param('roomId') id: string) {
    return this.messageService.removeALL(id);
  }
}
