import { Module } from '@nestjs/common';
import { AppPushService } from './app-push.service';
import { AppPushController } from './app-push.controller';

@Module({
  imports: [],
  providers: [AppPushService],
  controllers: [AppPushController],
})
export class AppPushModule {}
