import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { UpdateRoomDto } from './dtos/UpdateRoomDto';
import { CreateRoomDto } from './dtos/CreateRoomDto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly usersService: RoomsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateRoomDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.usersService.findOne({ name });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateRoomDto) {
    return this.usersService.update({ id, data });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
