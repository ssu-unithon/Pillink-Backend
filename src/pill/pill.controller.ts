import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PillAPIService } from './pill.api.service';
import { PillService } from './pill.service';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';
import { Pill } from './entity/pill.entity';

@Controller('pill')
export class PillController {
  constructor(
    private pillApiService: PillAPIService,
    private pillService: PillService,
  ) {}
  private readonly logger = new Logger('Pill');

  //SECTION - Pill API
  @Get('search')
  search(@Query('itemName') itemName: string, @Query('pageNo') pageNo: number) {
    return this.pillApiService.findByItemName(pageNo, itemName);
  }

  @Get('item/:itemSeq')
  async info(@Param('itemSeq') itemSeq: string) {
    return this.pillApiService.findOne(itemSeq);
  }

  // SECTION - Pill
  @UseGuards(LoginGuard)
  @Get()
  async getOwnPills(@Req() req: Request, @Query('targetId') targetId: number) {
    const payload = req.user as Payload;
    if (!targetId) return await this.pillService.getOwnedPills(payload.id);
    return await this.pillService.getFamilyPills(payload.id, targetId);
  }

  @UseGuards(LoginGuard)
  @Post()
  async insertTo(
    @Req() req: Request,
    @Body() body: { targetId: number; itemSeq: string },
  ): Promise<Pill> {
    const payload = req.user as Payload;
    return await this.pillService.insertToFamily(
      payload.id,
      body.targetId,
      body.itemSeq,
    );
  }

  @UseGuards(LoginGuard)
  @Patch()
  async modify(
    @Req() req: Request,
    @Body() body: { targetId: number; itemSeq: string },
  ): Promise<Pill> {
    const payload = req.user as Payload;
    return await this.pillService.insertToFamily(
      payload.id,
      body.targetId,
      body.itemSeq,
    );
  }
}
