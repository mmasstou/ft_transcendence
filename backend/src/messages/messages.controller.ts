import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateMessageDto } from 'src/Dtos/UpdateMessageDto';
import { Request } from 'express';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateMessageDto) {
    return this.messageService.update({ id, data });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
  @UseGuards(AuthGuard)
  @Delete('all/:roomId')
  removeALL(@Param('roomId') id: string) {
    return this.messageService.removeALL(id);
  }
}
