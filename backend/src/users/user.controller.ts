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

<<<<<<< HEAD
  //   @UseGuards(IntraAuthGuard)
  @UseGuards(JwtAuthGuard)
=======
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)

>>>>>>> a29e31291935884e1bdfbcad241d826059df25a9
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update({ id, data });
  }

  @UseGuards(JwtAuthGuard)
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
