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
import { RoomsService } from './rooms.service';
import { UpdateRoomDto } from './dtos/UpdateRoomDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body('name') name: string,
    @Body('type') type: string,
    @Req() request: Request,
  ) {
    const User_payload: any = request.user;
    const userId: any = User_payload.sub;
    return this.roomsService.create({ name, type, userId });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('users')
  findAlLForUser(@Req() request: Request) {
    const userIds: any = request.user;
    const userId: string = userIds.sub;
    return this.roomsService.findAlLForUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.roomsService.findOne({ name });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateRoomDto) {
    return this.roomsService.update({ id, data });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }

  // messages :
  @UseGuards(AuthGuard)
  @Post(':roomId/addmessage')
  AddMessage(
    @Param('roomId') roomId: string,
    @Body('content') content: string,
    @Req() request: Request,
  ) {
    const userIds: any = request.user;
    const userId: string = userIds.sub;
    return this.roomsService.AddMessage({ roomId, content, userId });
  }

  @UseGuards(AuthGuard)
  @Post('join')
  JoinUser(@Body('roomId') roomId: string, @Req() request: Request) {
    const User: any = request.user;
    const userId: any = User.sub;
    return this.roomsService.JoinUser({ userId, roomId });
  }

  @Patch(':roomId/:messageId')
  UpdateMessage(
    @Param('roomId') roomId: string,
    @Param('messageId') messageId: string,
    @Body('content') content: string,
  ) {
    return this.roomsService.UpdateMessage({ messageId, content });
  }
  @Delete(':roomId/:messageId')
  DeleteMessage(
    @Param('roomId') roomId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.roomsService.DeleteMessage({ messageId });
  }
  @UseGuards(AuthGuard)
  @Get('messages/:messageId')
  getaLLmessages(@Param('messageId') messageId: string) {
    return this.roomsService.getaLLmessages(messageId);
  }
  // members
}
