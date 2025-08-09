import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alarm } from './entity/alarm.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/auth/user.service';
import { CreateAlarmDTO, SaveAlarmDTO } from './dto/alarm.dto';
import { FamilyService } from 'src/family/family.service';

const relations = [];

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm) private repo: Repository<Alarm>,
    private userService: UserService,
    private familyService: FamilyService,
  ) {}

  async findOne(where: import('typeorm').FindOptionsWhere<Alarm>) {
    return await this.repo.findOne({ where, relations });
  }

  async getOrderedAlarms(targetId) {
    return await this.repo.find({
      where: { user: { id: targetId } },
      order: { hour: 'ASC', minute: 'ASC' },
    });
  }

  async save(dto: SaveAlarmDTO): Promise<Alarm> {
    return await this.repo.save(dto);
  }

  async makeAlarm(userId: number, dto: CreateAlarmDTO) {
    await this.familyService.hasRelationship(userId, dto.targetId);
    const targetUser = await this.userService.getById(dto.targetId);
    const alarm = await this.repo.save({ ...dto, user: targetUser });
    return alarm;
  }
}
