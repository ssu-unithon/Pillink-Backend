import { forwardRef, Module } from '@nestjs/common';
import { IntakeLogService } from './intake-log.service';
import { IntakeLogController } from './intake-log.controller';
import { IntakeLog } from './entity/intake-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmModule } from 'src/alarm/alarm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IntakeLog]),
    forwardRef(() => AlarmModule),
  ],
  providers: [IntakeLogService],
  controllers: [IntakeLogController],
  exports: [IntakeLogService],
})
export class IntakeLogModule {}
