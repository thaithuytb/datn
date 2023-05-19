import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GardenService } from './garden.service';
import { RoleGardenGuard } from '../../guards/roleGardenGuard';
import { Role } from '@prisma/client';

@Controller('api/v1/gardens')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}
  @Get()
  async getGardens(@Req() req: any) {
    if (req.user.role === Role.ADMIN) {
      return this.gardenService.getGardens({});
    }
    return this.gardenService.getGardens({ userId: req.user.id });
  }

  @UseGuards(RoleGardenGuard)
  @Get(':gardenId')
  async getGardenById(@Param('gardenId', ParseIntPipe) gardenId: number) {
    return this.gardenService.getGardenById(gardenId);
  }
}
