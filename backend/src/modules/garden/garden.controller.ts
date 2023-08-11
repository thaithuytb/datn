import {
  Body,
  Controller,
  Delete,
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
import {
  ChangeStatusGardenDto,
  CreateGardenDto,
  UpdateGardenDto,
} from './dto/garden.dto';
import { RoleAdminGuard } from '../../guards/roleAdminGuard';

@Controller('api/v1/gardens')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

  @UseGuards(RoleGardenGuard)
  @Post('/:gardenId/regime')
  async changeStatusGarden(
    @Body('dto')
    dto: ChangeStatusGardenDto,
    @Param('gardenId', ParseIntPipe) gardenId: number,
    @Req() req: any,
  ) {
    return this.gardenService.changeStatusGarden(dto, gardenId, req.user.id);
  }

  @Get()
  async getGardens(@Req() req: any) {
    if (req.user.role === Role.ADMIN) {
      return this.gardenService.getGardens({});
    }
    return this.gardenService.getGardens({ userId: req.user.id });
  }

  @UseGuards(RoleAdminGuard)
  @Post('create')
  async createGarden(@Body('dto') dto: CreateGardenDto) {
    return this.gardenService.createGarden(dto);
  }

  @UseGuards(RoleAdminGuard)
  @Post('delete')
  async deleteGarden(@Body('dto') dto: { id: number }) {
    return this.gardenService.deleteGarden(dto.id);
  }

  @UseGuards(RoleGardenGuard)
  @Post('update')
  async updateGarden(@Body('dto') dto: UpdateGardenDto) {
    return this.gardenService.updateGarden(dto);
  }
}
