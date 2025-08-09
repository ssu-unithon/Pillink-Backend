import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { LoginGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

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
    return await this.chatService.chat(payload.id, body.content);
  }
}
