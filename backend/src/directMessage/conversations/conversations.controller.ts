import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.conversationService.findAllConv();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':single')
  async findOne(@Body() reqBody: any) {
    //? body : { usersId: [id1, id2] }

    const [fs, sc] = reqBody.usersId;
    const criteria = {
      where: {
        AND: [{ users: { some: { id: fs } } }, { users: { some: { id: sc } } }],
      },
      include: {
        users: true,
      }
    };

    console.log(`${fs} : ${sc}`);

    const response = await this.conversationService.findConversation(criteria);
    if (response != null) return response;

    return this.conversationService.createNewConversation({
      data: {
        content: '... Created When Not Found!!',
        users: {
          connect: reqBody.usersId.map((id) => ({ id })),
        },
      },
      include: {
        users: true,
      }
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() reqBody: any) {
    //? body : {
    //?         content: "....Content...",
    //?         users: [id1, id2]
    //?        }

    const { content, usersId } = reqBody;

    const criteria = {
      data: {
        content: content,
        users: {
          connect: usersId.map((id) => ({ id })),
        },
      },
    };
    return this.conversationService.createNewConversation(criteria);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.conversationService.deleteConversation(id);
  }
}
