import { Body, Controller, Post } from '@nestjs/common';
import { AppPushService } from './app-push.service';

@Controller('app-push')
export class AppPushController {
  constructor(private readonly pushService: AppPushService) {}

  @Post('send')
  async sendNotification(
    @Body() body: { token: string; title: string; message: string },
  ) {
    return this.pushService.sendPush(body.token, body.title, body.message);
  }
}
