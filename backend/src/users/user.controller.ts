import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';
import { IntraAuthGuard } from 'src/auth/guards/intra-oauth.guard';
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(IntraAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('login')
  getLoginUser(@Req() request: Request) {
    const User_payload: any = request.user;
    const userId: any = User_payload.sub;
    return userId;
  }
  @Get(':username')
  findOne(@Param('username') login: string) {
    return this.usersService.findOne({ login });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update({ id, data });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // auther :
  @Get('direct-messages')
  async getUserDirectMessages(@Req() request: Request) {
    const User_payload: any = request.user;
    const userId: any = User_payload.sub;
    const directMessages = await this.usersService.getUserDirectMessages(
      userId,
    );
    return directMessages;
  }
}
