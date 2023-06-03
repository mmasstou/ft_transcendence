import { Controller, Get } from '@nestjs/common';
import { UserService } from './users/user.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Get()
  index() {
    return 'hello';
  }
}
