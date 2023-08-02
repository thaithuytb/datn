import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { Prisma, Threshold } from '@prisma/client';

@Injectable()
export class ThresholdRepository implements IThresholdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getThresholds(arg: Prisma.ThresholdFindManyArgs): Promise<Threshold[]> {
    return this.prisma.threshold.findMany(arg);
  }
}

export interface IThresholdRepository {
  getThresholds(arg: Prisma.ThresholdFindManyArgs): Promise<Threshold[]>;
}
