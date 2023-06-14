import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SampleService } from './sample.service';
import { CreateSampleDto } from './dto/sample.dto';
import { PublicMqttService } from '../../mqtt/publish';

@Controller('api/v1/sample')
export class SampleController {
  constructor(
    private readonly sampleService: SampleService,
    private readonly mqttService: PublicMqttService,
  ) {}

  @Get('publish')
  public publish(): void {
    this.mqttService.test();
  }

  @Get(':id')
  async getSampleById(@Param('id', ParseIntPipe) id: number) {
    return this.sampleService.getSampleById({
      id,
    });
  }

  @Post()
  async createSample(@Body('createSample') createSample: CreateSampleDto) {
    return this.sampleService.createSample(createSample);
  }
}
