import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { DataStatisticalService } from './data-statistical.service';
import { RoleGardenGuard } from '../../guards/roleGardenGuard';
import * as dayjs from 'dayjs';
import { Role } from '@prisma/client';

@UseGuards(RoleGardenGuard)
@Controller('api/v1/data-statistical')
export class DataStatisticalController {
  constructor(
    private readonly dataStatisticalService: DataStatisticalService,
  ) {}

  @Get('/')
  public getDataStatisticalByDate(
    @Req() req: any,
    @Query('time') time?: string,
  ): Promise<any> {
    return this.dataStatisticalService.getDataStatisticalByDate({
      userId: req.user.id,
      date: time ? dayjs(time) : dayjs().subtract(1, 'day'),
      isAdmin: req.user.role === Role.ADMIN,
    });
  }
}
