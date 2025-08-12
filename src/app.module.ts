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
import { AlarmModule } from './alarm/alarm.module';
import { Alarm } from './alarm/entity/alarm.entity';
import { IntakeLogModule } from './intake-log/intake-log.module';
import { IntakeLog } from './intake-log/entity/intake-log.entity';
import { AppPushModule } from './app-push/app-push.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Family, Pill, ChatMessage, Alarm, IntakeLog],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public', // http://localhost:3000/public/~~ 경로로 제공
    }),
    AuthModule,
    PillModule,
    FamilyModule,
    ChatModule,
    AlarmModule,
    IntakeLogModule,
    AppPushModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
