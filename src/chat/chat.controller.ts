import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  private logger = new Logger('Chat');

  @Get('history')
  @UseGuards(LoginGuard)
  async getHistoryMessages(@Req() req: Request) {
    const payload = req.user as Payload;
    return this.chatService.getHistoryByUID(payload.id);
  }

  @Post()
  @UseGuards(LoginGuard)
  async chat(@Req() req: Request, @Body() body: { content: string }) {
    const payload = req.user as Payload;
    this.logger.verbose(`AI chat '${body.content}'`);
    return { content: await this.chatService.chat(payload.id, body.content) };
  }

  @Get('risk')
  async getRisk(@Query('targetId') targetId: number) {
    this.logger.verbose('AI risk 조회');
    return await this.chatService.getRisk(targetId);
  }
}
