import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) {}

    async updateStatus(params: { id: string; status: string }): Promise<User> {
        const { id, status } = params;
        return await this.prisma.user.update({
          data : {status: status},
          where: { id },
        });
      }

    async updateTotalMatches(params: { id: string; TotalWin: number, TotalLose: number, TotalDraw: number }): Promise<User> {
        const { id, TotalWin, TotalLose, TotalDraw } = params;
        return await this.prisma.user.update({
          data : {TotalWin : TotalWin, TotalLose: TotalLose, TotalDraw: TotalDraw},
          where: { id },
        });
      }
    
    async CreateScore(params: {Player1: string, Player2: string, score1: number, score2: number}): Promise<any> {
        const {Player1, Player2, score1, score2} = params;
        return await this.prisma.match.create({
            data: {
                player1: {connect: {id: Player1}},
                player2: {connect: {id: Player2}},
                player1Score: score1,
                player2Score: score2,
            }
        })
    }
}
