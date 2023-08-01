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
import { MembersService } from './members.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
@Controller('members')
export class MembersController {
  constructor(private readonly messageService: MembersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body()
    data: {
      type: any | Prisma.EnumUserTypeFieldUpdateOperationsInput;
      roomId: string;
    },
  ) {
    const User: any = request.user;
    const userId = User.sub;
    return this.messageService.create({
      type: data.type,
      roomId: data.roomId,
      user: userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':roomId')
  findALLForRoom(@Param('roomId') roomId: string) {
    return this.messageService.findALLForRoom(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/:roomId')
  findOne(@Param('userId') userId: string, @Param('roomId') roomId: string) {
    return this.messageService.findOne({ userId, roomId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('type') type: Prisma.EnumUserTypeFieldUpdateOperationsInput,
  ) {
    return this.messageService.update({ id, type });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
