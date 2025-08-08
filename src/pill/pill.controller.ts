import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { PillAPIService } from './pill.api.service';

@Controller('pill')
export class PillController {
  constructor(private pillApiService: PillAPIService) {}
  private readonly logger = new Logger('Pill');

  @Get('search')
  search(@Query('itemName') itemName: string, @Query('pageNo') pageNo: number) {
    return this.pillApiService.findByItemName(pageNo, itemName);
  }

  @Get('item/:itemSeq')
  async info(@Param('itemSeq') itemSeq: number) {
    return this.pillApiService.findOne(itemSeq);
  }
}
