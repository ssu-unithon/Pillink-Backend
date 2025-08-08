import { Module } from '@nestjs/common';
import { PillService } from './pill.service';
import { PillController } from './pill.controller';
import { PillAPIService } from './pill.api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pill } from './entity/pill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pill])],
  providers: [PillService, PillAPIService],
  controllers: [PillController],
})
export class PillModule {}
