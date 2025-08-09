import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FamilyService } from './family.service';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';

@Controller('family')
export class FamilyController {
  constructor(private famliyService: FamilyService) {}

  @Get()
  @UseGuards(LoginGuard)
  async getMyFamily(@Req() req: Request) {
    const payload = req.user as Payload;
    return await this.famliyService.findByUID(payload.id);
  }

  @Post()
  @UseGuards(LoginGuard)
  async create(@Req() req: Request) {
    const payload = req.user as Payload;
    return await this.famliyService.create(payload.id);
  }

  @Get('leave')
  @UseGuards(LoginGuard)
  async leave(@Req() req: Request) {
    const payload = req.user as Payload;
    return await this.famliyService.leave(payload.id);
  }

  @Get('invite')
  @UseGuards(LoginGuard)
  async invite(@Req() req: Request, @Query('targetPhone') targetPhone: string) {
    if (!targetPhone)
      throw new BadRequestException('검색할 전화번호를 입력하세요');
    const payload = req.user as Payload;
    return await this.famliyService.insert(payload.id, targetPhone);
  }
}
