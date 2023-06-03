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
import { CreateRoomDto } from './dtos/CreateRoomDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateRoomDto) {
    return this.roomsService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.roomsService.findAll();
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
    console.log('content :', content);
    return this.roomsService.AddMessage({ roomId, content, userId });
  }

  @Patch(':roomId/:messageId')
  UpdateMessage(
    @Param('roomId') roomId: string,
    @Param('messageId') messageId: string,
  ) {
    return '';
  }
  @Delete(':roomId/:messageId')
  DeleteMessage(
    @Param('roomId') roomId: string,
    @Param('messageId') messageId: string,
  ) {
    return '';
  }
  // members
}
