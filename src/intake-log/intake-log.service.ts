import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ALARM_CONFIRM, IntakeLog } from './entity/intake-log.entity';
import { Repository } from 'typeorm';
import { AlarmService } from 'src/alarm/alarm.service';

const relations = [];
@Injectable()
export class IntakeLogService {
  constructor(
    @InjectRepository(IntakeLog) private repo: Repository<IntakeLog>,
    private alarmService: AlarmService,
  ) {}

  async findOne(where: import('typeorm').FindOptionsWhere<IntakeLog>) {
    return await this.repo.findOne({ where, relations });
  }

  async find(where: import('typeorm').FindOptionsWhere<IntakeLog>) {
    return await this.repo.find({ where, relations });
  }

  /** intake가 없다면, 빈 기록 생성 */
  async load(userId: number, month: number, date: number) {
    const existIntake = await this.findOne({
      user: { id: userId },
      month,
      date: date,
    });
    if (existIntake) return existIntake;
    const alarms = await this.alarmService.getOrderedAlarms(userId);
    const alarm_confirms: ALARM_CONFIRM[] = [];
    alarms.forEach((alarm) =>
      alarm_confirms.push({ alarmId: alarm.id, is_checked: false }),
    );
    return await this.repo.save({
      user: { id: userId },
      alarm_confirms,
      month,
      date,
    });
  }

  isAllTrue(alarm_confirms: ALARM_CONFIRM[]) {
    for (let i = 0; i < alarm_confirms.length; i++)
      if (!alarm_confirms[i].is_checked) return false;
    return true;
  }

  async check(targetId: number, month: number, date: number, alarmId: number) {
    const intake = await this.load(targetId, month, date);
    for (let i = 0; i < intake.alarm_confirms.length; i++)
      if (intake.alarm_confirms[i].alarmId === alarmId) {
        intake.alarm_confirms[i].is_checked = true;
        break;
      }
    if (this.isAllTrue(intake.alarm_confirms)) intake.is_checked = true;
    return await this.repo.save(intake);
  }
}
