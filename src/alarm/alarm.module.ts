import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from './entity/alarm.entity';
import { FamilyModule } from 'src/family/family.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alarm]), AuthModule, FamilyModule],
  providers: [AlarmService],
  controllers: [AlarmController],
})
export class AlarmModule {}
