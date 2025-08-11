import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from './entity/alarm.entity';
import { FamilyModule } from 'src/family/family.module';
import { IntakeLogModule } from 'src/intake-log/intake-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alarm]),
    AuthModule,
    FamilyModule,
    IntakeLogModule,
  ],
  providers: [AlarmService],
  controllers: [AlarmController],
})
export class AlarmModule {}
