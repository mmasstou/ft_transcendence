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
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';
import { Request } from 'express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // create(
  //   @Body('name') name: string,
  //   @Body('type') type: string,
  //   @Req() request: Request,
  // ) {
  //   const User_payload: any = request.user;
  //   const userId: any = User_payload.sub;
  //   return this.roomsService.create({ name, type, userId });
  // }

  @UseGuards(JwtAuthGuard)
  @Get('public&protected')
  findPublicAndProtected(@Req() request: Request) {
    const userIds: any = request.user;
    const login: string = userIds.login;
    return this.roomsService.findPublicAndProtected(login);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('notification/:channeLId')
  findNotifications(
    @Req() request: Request,
    @Param('channeLId') channeLId: string,
  ) {
    const userIds: any = request.user;
    const login: string = userIds.login;
    return this.roomsService.findNotifications({ login, channeLId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findALLUser(@Req() request: Request) {
    const userIds: any = request.user;
    const userId: string = userIds.login;
    return this.roomsService.findUserRooms(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('owners/:channeLId')
  findOwners(@Param('channeLId') channeLId: string) {
    return this.roomsService.findOwners({ channeLId });
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateRoomDto) {
    return this.roomsService.update({ id, data });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }

  // messages :
  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Get('messages/:messageId')
  getaLLmessages(@Param('messageId') messageId: string) {
    return this.roomsService.getaLLmessages(messageId);
  }
  // members
}
