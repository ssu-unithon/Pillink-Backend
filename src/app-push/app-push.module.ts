import { Module } from '@nestjs/common';
import { AppPushService } from './app-push.service';
import { AppPushController } from './app-push.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AppPushService],
  controllers: [AppPushController],
})
export class AppPushModule {}
