import { Module } from '@nestjs/common';
import { PillService } from './pill.service';
import { PillController } from './pill.controller';
import { PillAPIService } from './pill.api.service';

@Module({
  providers: [PillService, PillAPIService],
  controllers: [PillController],
})
export class PillModule {}
