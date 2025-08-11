import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entity/ChatMessage.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ChatAPIService } from './chat.api.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage]), AuthModule],
  providers: [ChatService, ChatAPIService],
  controllers: [ChatController],
})
export class ChatModule {}
