import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GardenService } from './garden.service';
import { RoleGardenGuard } from '../../guards/roleGardenGuard';
import { Role } from '@prisma/client';
import { ChangeStatusGardenDto } from './dto/garden.dto';

@Controller('api/v1/gardens')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

  @UseGuards(RoleGardenGuard)
  @Post('/:gardenId/regime')
  async changeStatusGarden(
    @Body('dto')
    dto: ChangeStatusGardenDto,
    @Param('gardenId', ParseIntPipe) gardenId: number,
  ) {
    console.log({ dto });
    return this.gardenService.changeStatusGarden(dto, gardenId);
  }

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
