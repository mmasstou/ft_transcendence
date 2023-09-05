import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessagesService {

    constructor(private prismaService: PrismaService) {}

    async newMessage(senderId: string, content: string, conversationId?: string) {
        return await this.prismaService.messages.create({
            data: {
                content,
                sender: {
                    connect: {id: senderId}
                },
                Conversation: {
                    connect: {id: conversationId}
                },
            },
            include: {
                sender: true,
            }
        })
    }

}
