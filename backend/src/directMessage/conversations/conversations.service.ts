import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prismaService: PrismaService) {}

  async findAllConv() {
    return await this.prismaService.conversation.findMany();
  }

  async findConversation(criteria) {
    return await this.prismaService.conversation.findFirst(criteria);
  }

  async  createNewConversation(criteria) {
    return this.prismaService.conversation.create(criteria);
  }
}
