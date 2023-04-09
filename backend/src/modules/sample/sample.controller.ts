import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SampleService } from './sample.service';
import { CreateSampleDto } from './dto/sample.dto';

@Controller('sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Get()
  async getSamples(
    @Query('status', ParseBoolPipe) status = true,
    @Query('name') name = '',
  ) {
    return await this.sampleService.getSamples({
      name,
      status,
    });
  }

  @Get(':id')
  async getSampleById(@Param('id', ParseIntPipe) id: number) {
    return await this.sampleService.getSampleById({
      id,
    });
  }

  @Post()
  async createSample(@Body('createSample') createSample: CreateSampleDto) {
    return await this.sampleService.createSample(createSample);
  }
}
