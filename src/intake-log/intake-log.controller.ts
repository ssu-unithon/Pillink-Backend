import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { CheckIntakeDTO } from './dto/intake-log.dto';
import { Payload } from 'src/auth/security/payload.interface';
import { IntakeLogService } from './intake-log.service';

@Controller('intake-log')
export class IntakeLogController {
  constructor(private intakeLogService: IntakeLogService) {}

  @Get()
  @UseGuards(LoginGuard)
  async getCalender(@Req() req: Request, @Query('month') month: number) {
    if (!month || isNaN(Number(month)))
      throw new BadRequestException('조회할 달(month)를 입력하세요');
    const payload = req.user as Payload;
    return await this.intakeLogService.find({
      user: { id: payload.id },
      month,
    });
  }

  @Post('check')
  @UseGuards(LoginGuard)
  async check(@Req() req: Request, @Body() dto: CheckIntakeDTO) {
    const payload = req.user as Payload;
    return await this.intakeLogService.check(
      payload.id,
      dto.month,
      dto.date,
      dto.alarmId,
    );
  }
}
