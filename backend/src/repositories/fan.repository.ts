import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { Fan} from '@prisma/client';

@Injectable()
export class FanRepository implements IFanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFanLatestStatus() {
    return this.prisma.fan.findFirst({
      orderBy: {
        id: 'desc'
      } 
    })
  }
}

export interface IFanRepository {
  getFanLatestStatus(): Promise<Fan>;
}
