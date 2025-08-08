import { Controller, Get, Logger, Query } from '@nestjs/common';
import { PillAPIService } from './pill.api.service';

@Controller('pill')
export class PillController {
  constructor(private pillApiService: PillAPIService) {}
  private readonly logger = new Logger('Pill');

  @Get()
  test(@Query('itemName') itemName: string) {
    return this.pillApiService.findByItemName(1, itemName);
  }
}
