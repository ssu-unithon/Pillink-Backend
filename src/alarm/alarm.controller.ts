import {
  Body,
  Controller,
  Get,
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
    return await this.alarmService.makeAlarm(payload.id, dto);
  }
}
