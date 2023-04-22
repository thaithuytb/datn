import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GardenService } from './garden.service';

@Controller('api/v1/gardens')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

  @Get()
  async getGardens() {
    return this.gardenService.getGardens();
  }

  @Get(':id')
  async getGardenById(@Param('id', ParseIntPipe) id: number) {
    return this.gardenService.getGardenById(id);
  }
}
