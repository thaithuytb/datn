import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GardenService } from './garden.service';
import { RoleGardenGuard } from '../../guards/roleGardenGuard';
import { RoleAdminGuard } from '../../guards/roleAdminGuard';

@Controller('api/v1/gardens')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

  @UseGuards(RoleAdminGuard)
  @Get()
  async getGardens() {
    return this.gardenService.getGardens();
  }

  @UseGuards(RoleGardenGuard)
  @Get(':gardenId')
  async getGardenById(@Param('gardenId', ParseIntPipe) gardenId: number) {
    return this.gardenService.getGardenById(gardenId);
  }
}
