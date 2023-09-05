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
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //   @UseGuards(IntraAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('sendingrequests/all')
  async getFriends(@Req() request: Request) {
    const User: any = request.user;
    const id: any = User.id;
    return await this.usersService.getAllSendingRequests(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends/accepted')
  async getAcceptedFriendRequests(@Req() request: Request) {
    const User: any = request.user;
    const id: any = User.id;
    return await this.usersService.getFriends(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends/:id')
  async getFriend(@Param('id') id: string) {
    return await this.usersService.getFriend(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('friendRequests')
  async getFriendRequests(@Req() request: Request) {
    const User: any = request.user;
    const id: any = User.id;
    return await this.usersService.getFriendRequests(id);
  }

  // get all non friend users
  @UseGuards(JwtAuthGuard)
  @Get('nonfriends')
  async getNonFriends(@Req() request: Request) {
    const User: any = request.user;
    const id: any = User.id;
    return await this.usersService.getNonFriends(id);
  }

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

  // friends actions

  // send friend request
  @UseGuards(JwtAuthGuard)
  @Post('friend-requests/send')
  async sendFriendRequest(
    @Req() req,
    @Body('receiverId') receiverId: string,
  ): Promise<void> {
    const senderId = req.user.id;
    await this.usersService.sendFriendRequest(senderId, receiverId);

    // Notify the receiver about the friend request
    this.notificationsGateway.sendNotification(
      receiverId,
      'You have a new friend request.',
    );
  }

  // accept friend request

  @UseGuards(JwtAuthGuard)
  @Post('friend-requests/accept/:id')
  async acceptFriendRequest(
    @Req() req,
    @Body('senderId') senderId: string,
    @Param('id') id: string,
  ): Promise<void> {
    const receiverId = req.user.id;
    await this.usersService.acceptFriendRequest(receiverId, senderId, id);

    // Notify the sender about the accepted friend request
    this.notificationsGateway.sendNotification(
      senderId,
      'Your friend request has been accepted.',
    );
  }

  // reject friend request
  @UseGuards(JwtAuthGuard)
  @Post('friend-requests/reject/:id')
  async rejectFriendRequest(
    @Req() req,
    @Body('senderId') senderId: string,
    @Param('id') id: string,
  ): Promise<void> {
    const receiverId = req.user.id;
    await this.usersService.rejectFriendRequest(receiverId, senderId, id);

    // Notify the sender about the rejected friend request
    this.notificationsGateway.sendNotification(
      senderId,
      'Your friend request has been rejected.',
    );
  }
  // remover frinend request
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

  // end of friends actions

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

}
