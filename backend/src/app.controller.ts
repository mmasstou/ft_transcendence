import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly userService: AppService) {}

  @Get()
  index() {
    return this.userService.getHello();
  }
}
