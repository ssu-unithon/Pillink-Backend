import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entity/user.entity';
import { PillModule } from './pill/pill.module';
import { FamilyModule } from './family/family.module';
import { Family } from './family/entity/family.entity';
import { Pill } from './pill/entity/pill.entity';
import { ChatModule } from './chat/chat.module';
import { ChatMessage } from './chat/entity/ChatMessage.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Family, Pill, ChatMessage],
      synchronize: true,
    }),
    AuthModule,
    PillModule,
    FamilyModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
