import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prismaService: PrismaService) { }

  async findAllConv() {
    return await this.prismaService.conversation.findMany({
      include: {
        users: true,
        messages: true
      }
    });
  }

  async findConversation(criteria) {
    return await this.prismaService.conversation.findFirst(criteria);
  }

  async createNewConversation(criteria) {
    return this.prismaService.conversation.create(criteria);
  }

  async deleteConversation(id: string) {
    return this.prismaService.conversation.delete({
      where: {
        id,
      }
    })
  }


  async findOnlyOne(id: string) {
    return this.prismaService.conversation.findUnique(
      { 
        where: {id},
        include: {
          users: true,
          messages: true,
        }
      }
      )
}
}

