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
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';
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
  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get('login/:login')
  getUserWithLogin(@Param('login') login: string) {
    return this.usersService.findOneLogin({ login });
  }
  // @UseGuards(JwtAuthGuard)
  @Get('login')
  getLoginUser(@Req() request: Request) {
    const User_payload: any = request.user;
    const userId: any = User_payload.sub;
    return userId;
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    // check if the data contains only login field
    if (
      Object.keys(data).length !== 1 ||
      !data.login ||
      this.usersService.isLoginValid(data.login) === false
    ) {
      throw new BadRequestException('Invalid data');
    }
    // check if login user already exist
    const user = await this.usersService.findOneLogin({ login: data.login });
    if (user) {
      throw new BadRequestException('Login already exist');
    }
    return await this.usersService.update({ id, data });
  }

  // @UseGuards(JwtAuthGuard)
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
