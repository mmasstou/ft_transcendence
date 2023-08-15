import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prismaService: PrismaService) {}

  async findConversation() {
    return await this.prismaService.conversation.findMany();
  }
}
