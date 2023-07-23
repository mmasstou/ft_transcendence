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
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
@Controller('members')
export class MembersController {
  constructor(private readonly messageService: MembersService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':roomId')
  findALLForRoom(@Param('roomId') roomId: string) {
    return this.messageService.findALLForRoom(roomId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('type') type: Prisma.EnumUserTypeFieldUpdateOperationsInput,
  ) {
    return this.messageService.update({ id, type });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
