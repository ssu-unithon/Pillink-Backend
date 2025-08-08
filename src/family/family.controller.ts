import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FamilyService } from './family.service';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';

@Controller('famliy')
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

  @Post('leave')
  @UseGuards(LoginGuard)
  async leave(@Req() req: Request) {
    const payload = req.user as Payload;
    return await this.famliyService.leave(payload.id);
  }
}
