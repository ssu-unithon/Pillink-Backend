import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { CreateAlarmDTO } from './dto/alarm.dto';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';

@Controller('alarm')
export class AlarmController {
  constructor(private alarmService: AlarmService) {}
  private logger = new Logger('Alarm');

  @Get()
  @UseGuards(LoginGuard)
  async getAlarms(@Req() req: Request, @Query('targetId') targetId: number) {
    const payload = req.user as Payload;
    let userId = payload.id;
    if (targetId) userId = targetId;
    return await this.alarmService.getOrderedAlarms(userId);
  }

  @Post()
  @UseGuards(LoginGuard)
  async create(@Req() req: Request, @Body() dto: CreateAlarmDTO) {
    const payload = req.user as Payload;
    this.logger.verbose(`${payload.email} ${dto.hour}:${dto.minute} 알림 생성`);
    return await this.alarmService.makeAlarm(payload.id, dto);
  }

  @Patch()
  async update(
    @Body()
    dto: {
      alarmId: number;
      hour: number;
      minute: number;
      count: number;
    },
  ) {
    this.logger.verbose(`${dto.alarmId} ${dto.hour}:${dto.minute} 알림 수정`);
    return await this.alarmService.update(
      dto.alarmId,
      dto.hour,
      dto.minute,
      dto.count,
    );
  }
}
