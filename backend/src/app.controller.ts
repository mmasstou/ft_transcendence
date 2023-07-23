import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly userService: AppService) {}

  @Get()
  index() {
    console.log('index page');
    return '<h2>Hello World!</h2>';
  }
}
