import { Controller, Get, Param, UseGuards, Req, Body } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Body() reqBody: any) {
    const [fs, sc] = reqBody.users;
    return this.conversationService.findConversation();
  }
}
