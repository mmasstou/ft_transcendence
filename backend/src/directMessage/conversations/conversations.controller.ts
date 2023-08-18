import { Controller, Get, Param, UseGuards, Req, Body, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationService: ConversationsService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.conversationService.findAllConv();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':single')
  findOne(@Body() reqBody: any) {

    //? body : { users: [id1, id2] }

    const [fs, sc] = reqBody.users;
    const criteria = {
      where: {
				AND: [
					{users: {some: {id: fs}}} ,
					{users: {some: {id: sc}}}
				]
			} 
    };
    return this.conversationService.findConversation(criteria);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() reqBody: any) {

    //? body : { 
    //?         content: "....Content...",
    //?         users: [id1, id2] 
    //?        }


    const [content, usersId] = reqBody;
    
    console.log(content);
    console.log(usersId);

    const criteria = {
      data: {
        content: content,
        users: {
          connect: usersId.map((id) => ({id}))
        }
      }
    }
    return this.conversationService.createNewConversation(criteria)
  }
}
