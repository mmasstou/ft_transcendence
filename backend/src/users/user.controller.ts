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
  Res,
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

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('friends/all')
  async getFriends(@Req() request: Request) {
    const User: any = request.user;
    const id: any = User.id;
    return await this.usersService.getFriends(id);
  }
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

  @UseGuards(JwtAuthGuard)
  @Post('addfriend')
  async addFriend(@Body('friendId') friendId: string, @Req() request: Request) {
    if (friendId === null || friendId === 'undefined' || !friendId) {
      request.res.status(400).send('bad request, missing parameter');
      throw new BadRequestException('Missing parameters');
    }
    const friend = await this.usersService.findOne({ id: friendId });
    if (!friend) {
      request.res.status(404).send('user not found');
      throw new BadRequestException('user not found');
    }

    // check if the user is not already friend
    const User: any = request.user;
    const id: any = User.id;
    if (await this.usersService.isFriend(friendId, id)) {
      request.res.status(400).send('user already friend');
      throw new BadRequestException('user already friend');
    }
    return await this.usersService.addFriend(id, friendId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('removefriend')
  async removeFriend(
    @Body('friendId') friendId: string,
    @Res() res: any,
    @Req() request: Request,
  ) {
    const User: any = request.user;
    const id: any = User.id;
    if (friendId === null || friendId === 'undefined' || !friendId) {
      res.status(400).send('bad request, missing parameter');
      throw new BadRequestException('Missing parameters');
    }
    const isFriend = await this.usersService.isFriend(id, friendId);
    if (!isFriend) {
      res.status(404).send('Friend not found');
      throw new BadRequestException('Friend not found');
    }
    const removeFriend = await this.usersService.removeFriend(friendId, id);
    if (removeFriend) {
      res.status(200).send('Friend removed');
      return removeFriend;
    }
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
