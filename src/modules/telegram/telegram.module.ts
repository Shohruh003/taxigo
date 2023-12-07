import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import * as dotenv from 'dotenv';
import { User } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Reklama } from '../reklama/reklama.entity';
import { Message } from '../message/message.entity';
import { MessageService } from '../message/message.service';
import { ReklamaService } from '../reklama/reklama.service';

dotenv.config();

@Module({
  imports: [TypeOrmModule.forFeature([User, Reklama, Message])],
  providers: [TelegramService, UserService, MessageService, ReklamaService],
  exports: [TelegramService],
})
export class TelegramModule {}
