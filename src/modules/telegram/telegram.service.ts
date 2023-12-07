  import { Injectable } from '@nestjs/common';
  import * as dotenv from 'dotenv';
  import { Telegraf, Markup } from 'telegraf';
  import { User } from '../user/user.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Reklama } from '../reklama/reklama.entity';
  import { Message } from '../message/message.entity';

  dotenv.config();

  @Injectable()
  export class TelegramService {
      private savedText: string;
      private isSending: boolean = false;
      private adText: string;
      private isText: boolean = false;
      private interval: NodeJS.Timeout;
      private userId: string;
      
      constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Reklama)
        private readonly reklamaRepository: Repository<Reklama>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
      ) {
        const bot = new Telegraf(process.env.TOKEN);
      bot.start((ctx) => this.handleStartCommand(ctx));
      bot.on('text', (ctx) => this.handleIncomingText(ctx));
      bot.on('message', (ctx) => this.handleReklamaButton(ctx));
      bot.on('message', (ctx) => this.handleAddButton(ctx));
      bot.on('message', (ctx) => this.handleDeleteButton(ctx));
      bot.on('message', (ctx) => this.handleBackButton(ctx));
      bot.on('message', (ctx) => this.handleHomeButton(ctx));
      bot.launch();

    }

    handleStartCommand(ctx) {
      const userId = ctx.message.from.id.toString();
      console.log(userId);
      this.userRepository.findOne({ where: { from_id: userId } }).then((user) => {
        if (!user) {
          const newUser = new User();
          newUser.from_id = userId;
          this.userRepository.save(newUser);
        }
        if (userId === "1023561736") {
          this.isSending = true;
          this.isText = false;
          const keyboard = Markup.keyboard([
            ["🏁 REKLAMA"],
          ]).resize().reply_markup;
    
          ctx.reply('Bot ishga tushdi. Assalomu alaykum!', {
            reply_markup: keyboard,
          });
        } else {
          ctx.reply('Assalomu alaykum!');
        }
      }).catch((error) => {
        console.error('Xatolik yuz berdi:', error);
      });
    }

    handleHomeButton(ctx) {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === "1023561736") {
      const keyboard = Markup.keyboard([
        ["🏁 REKLAMA"],
      ]).resize().reply_markup;
    
      ctx.reply('Bosh sahifa 🏘', {
        reply_markup: keyboard,
      });
    }
    }

    private handleReklamaButton(ctx): void {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === "1023561736") {

      const keyboard = Markup.keyboard([
        ["➕ QO'SHISH","❌ O'CHIRISH"],
        ["🏘 BOSH SAHIFA"],
      ]).resize().reply_markup;
      
      ctx.reply("Kerakli bo'limni tanlang!", {
        reply_markup: keyboard,
      });
    }
    }

    private handleAddButton(ctx): void {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === "1023561736") {

      this.isText = true
      this.isSending = false
      const keyboard = Markup.keyboard([
          ["🏘 BOSH SAHIFA"],
        ["⬅️ ORQAGA"],
      ]).resize().reply_markup;
      
      ctx.reply("🏁 Reklama kiriting !", {
        reply_markup: keyboard,
      });
    }
    }

    private handleBackButton(ctx): void {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === "1023561736") {

      const keyboard = Markup.keyboard([
          ["➕ QO'SHISH", "❌ O'CHIRISH"],
          ["🏘 BOSH SAHIFA"],
        ]).resize().reply_markup;
        
        ctx.reply("Kerakli bo'limni tanlang!", {
          reply_markup: keyboard,
        });
      }
    }

    private async sendTextRepeatedly(ctx): Promise<void> {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === "1023561736") {
        const text = ctx.message.text
        this.savedText = text
        const newReklama = new Reklama();
        newReklama.from_id = this.userId;
        newReklama.message_id = ctx.message.message_id.toString();
        this.reklamaRepository.save(newReklama);
        
        // Boshqa foydalanuvchilarga yangi matn jo'natish
        const users = await this.userRepository.find();
        for (const user of users) {
          if (user.from_id !== this.userId) {
            setInterval(() => {
              ctx.telegram.sendMessage(user.from_id, this.savedText)
                .catch((error) => {
                  console.error('Xatolik yuz berdi:', error);
                });
            }, 5000);
          }
        }
      }
    }

    private stopSending(ctx): void {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === "1023561736") {
        clearInterval(this.interval);
        this.interval = null;
        this.isSending = false
        this.savedText = null
      }
    }

    private handleDeleteButton(ctx): void {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === "1023561736") {

      ctx.reply("🏁 Reklama o'chirildi ‼️");
      this.stopSending(ctx);
      }
    }

    private async sendTextOnce(ctx): Promise<void> {
      this.userId = ctx.message.from.id.toString();
      const isAdmin = this.userId === "1023561736";
      if (isAdmin || !this.isText) {
        if (isAdmin) {
          const newMessage = new Message();
          newMessage.from_id = this.userId;
          newMessage.message_id = ctx.message.message_id.toString();
          await this.messageRepository.save(newMessage);
        }
    
        if (isAdmin) {
          const users = await this.userRepository.find();
          for (const user of users) {
            if (user.from_id !== this.userId) {
              ctx.telegram.sendMessage(user.from_id, this.adText)
                .catch((error) => {
                  console.error('Xatolik yuz berdi:', error);
                });
            }
          }
        } else {
          ctx.telegram.sendMessage(this.userId, 'Kechirasiz, siz admin emassiz!')
            .catch((error) => {
              console.error('Xatolik yuz berdi:', error);
            });
        }
    
        this.isText = false;
        this.adText = null;
      }
    }

    private handleIncomingText(ctx): void {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === "1023561736") {
      const text = ctx.message.text;
      if (text === "🏁 REKLAMA") {
          this.handleReklamaButton(ctx);
        } else if (text === "🏘 BOSH SAHIFA") {
          this.handleHomeButton(ctx);
        }else if (text === "➕ QO'SHISH") {
            this.handleAddButton(ctx);
        } else if (text === "❌ O'CHIRISH") {
          this.handleDeleteButton(ctx);
        } else if (text === "⬅️ ORQAGA") {
          this.handleBackButton(ctx);
        }else {
          if (this.isText === false) {
        this.adText = text;
        this.sendTextOnce(ctx);
        ctx.reply("📝 Xabar jo'natildi ✅");
      } else if (this.isSending === false) {
        this.sendTextRepeatedly(ctx);
        ctx.reply("🏁 Reklama jo'natildi ✅");
      } else {
        ctx.reply("Kerakli bo'limni tanlang!");
      } 
        }
  }
    }
  }