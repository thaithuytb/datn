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
import { PublicMqttService } from '../../mqtt/publish';

@Controller('sample')
export class SampleController {
  constructor(
    private readonly sampleService: SampleService,
    private readonly mqttService: PublicMqttService,
  ) {}

  @Get('publish')
  public publish(@Query('topic') topic: string): void {
    this.mqttService.sendMessage(
      topic,
      'thaidz' + (Math.random() * 100).toString(),
    );
  }

  @Get()
  async getSamples(
    @Query('status', ParseBoolPipe) status = true,
    @Query('name') name = '',
  ) {
    return this.sampleService.getSamples({
      name,
      status,
    });
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
