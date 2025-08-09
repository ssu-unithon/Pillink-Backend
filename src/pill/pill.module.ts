import { Module } from '@nestjs/common';
import { PillService } from './pill.service';
import { PillController } from './pill.controller';
import { PillAPIService } from './pill.api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pill } from './entity/pill.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FamilyModule } from 'src/family/family.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pill]), AuthModule, FamilyModule],
  providers: [PillService, PillAPIService],
  exports: [PillService, PillAPIService],
  controllers: [PillController],
})
export class PillModule {}
