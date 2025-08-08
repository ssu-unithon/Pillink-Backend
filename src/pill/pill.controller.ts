import { Controller, Get, Logger, Query } from '@nestjs/common';
import { PillAPIService } from './pill.api.service';

@Controller('pill')
export class PillController {
  constructor(private pillApiService: PillAPIService) {}
  private readonly logger = new Logger('Pill');

  @Get('search')
  test(@Query('itemName') itemName: string, @Query('pageNo') pageNo: number) {
    return this.pillApiService.findByItemName(pageNo ?? 1, itemName);
  }
}
