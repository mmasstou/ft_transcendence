import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';
import { DmService } from './dm.service';

@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.dmService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dmService.findOne(id);
  }
}
