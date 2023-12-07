import { Module } from '@nestjs/common';
import { TelegramModule } from './modules/telegram/telegram.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { User } from './modules/user/user.entity';
import { ReklamaModule } from './modules/reklama/reklama.module';
import { MessageController } from './modules/message/message.controller';
import { MessageService } from './modules/message/message.service';
import { MessageModule } from './modules/message/message.module';
import { Message } from './modules/message/message.entity';
import { Reklama } from './modules/reklama/reklama.entity';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.DB_PASSWORD,
      port: 5432,
      username: process.env.DB_USER,
      entities: [User, Message, Reklama],
      synchronize: true,
    }),
    TelegramModule,
    UserModule,
    ReklamaModule,
    MessageModule
  ]
})
export class AppModule {}
