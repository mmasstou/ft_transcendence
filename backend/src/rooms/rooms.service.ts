import { Injectable } from '@nestjs/common';
import { Prisma, Rooms } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateRoomDto } from './dtos/UpdateRoomDto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findOne(params: { name: string }): Promise<Rooms> {
    const { name } = params;
    console.log('++findOne++>', name);
    return await this.prisma.rooms.findUnique({
      where: { name },
    });
  }

  async findAll(): Promise<Rooms[]> {
    return this.prisma.rooms.findMany();
  }

  async create(data: Prisma.RoomsCreateInput): Promise<Rooms> {
    return await this.prisma.rooms.create({
      data,
    });
  }

  async update(params: { id: string; data: UpdateRoomDto }): Promise<Rooms> {
    const { id, data } = params;
    console.log('++update++>', id);

    return await this.prisma.rooms.update({
      data,
      where: { id },
    });
  }

  async remove(id: string): Promise<Rooms> {
    console.log('++remove++>', id);

    return await this.prisma.rooms.delete({
      where: { id },
    });
  }
}
