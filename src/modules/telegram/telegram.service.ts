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
      private readonly admin1Id: string = "1023561736";
      private readonly admin2Id: string = "1319773743";
      private readonly admin3Id: string = "66048079";
      
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
      bot.on('message', (ctx) => this.handleCountButton(ctx));
      bot.launch();

    }

    handleStartCommand(ctx) {
      const userId = ctx.message.from.id.toString();
      
      this.userRepository.findOne({ where: { from_id: userId } }).then((user) => {
        if (!user) {
          const newUser = new User();
          newUser.from_id = userId;
          this.userRepository.save(newUser);
        }
        if (userId === this.admin1Id || userId === this.admin2Id || userId === this.admin3Id) {
          this.isSending = true;
          this.isText = false;
          const keyboard = Markup.keyboard([
            ["🏁 REKLAMA"],
            ["🙍‍♂️ F0YDALANUVCHILAR SONI"]
          ]).resize().reply_markup;
    
          ctx.reply('Bot ishga tushdi. Assalomu alaykum!', {
            reply_markup: keyboard,
          });
        } else {
          ctx.reply("Assalomu alaykum 🖐 \n\nNamangan Toshkent yo'nalishi bo'yicha taxi 🚖 qidiryapsizmi? \n\nTaxi chaqirish 🚕 uchun quyidagi guruhga qo'shiling !!! \n\n👇👇👇👇👇👇👇👇👇👇👇👇👇 \n\nhttps://t.me/Namangan_tashkent_pitak");
        }
      }).catch((error) => {
        console.error('Xatolik yuz berdi:', error);
      });
    }

    handleHomeButton(ctx) {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === this.admin1Id || this.userId === this.admin2Id || this.userId === this.admin3Id) {
        this.isSending = true
        this.isText = false
      const keyboard = Markup.keyboard([
        ["🏁 REKLAMA"],
        ["🙍‍♂️ F0YDALANUVCHILAR SONI"]
      ]).resize().reply_markup;
    
      ctx.reply('Bosh sahifa 🏘', {
        reply_markup: keyboard,
      });
    }
    }

    private handleReklamaButton(ctx): void {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === this.admin1Id || this.userId === this.admin2Id || this.userId === this.admin3Id) {

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
      if (this.userId === this.admin1Id || this.userId === this.admin2Id || this.userId === this.admin3Id) {

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
      if (this.userId === this.admin1Id || this.userId === this.admin2Id || this.userId === this.admin3Id) {

        this.isSending = true
        this.isText = false
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
      if (this.userId === this.admin1Id || this.userId === this.admin2Id || this.userId === this.admin3Id) {
        const text = ctx.message.text;
        if (text.trim() !== "") {
          this.savedText = text;
          const newReklama = new Reklama();
          newReklama.from_id = this.userId;
          newReklama.message_id = ctx.message.message_id.toString();
          newReklama.message_text = ctx.message.text.toString();
          this.reklamaRepository.save(newReklama);
    
          // Send the saved text to other users repeatedly
          const users = await this.userRepository.find();
          const reklama = await this.reklamaRepository.find();
    
          for (const user of users) {
            if (user.from_id !== this.userId) {
              try {
                const chatMember = await ctx.telegram.getChatMember(user.chat_id, user.from_id);
    
                if (chatMember && chatMember.status !== 'left' && chatMember.status !== 'kicked') {
                  const intervalId = setInterval(async () => {
                    if (this.savedText) {
                      try {
                        await ctx.telegram.sendMessage(user.from_id, this.savedText);
                      } catch (error) {
                        return;
                      }
                    } else {
                      clearInterval(intervalId);
                    }
                  }, 7 * 24 * 60 * 60 * 1000);
                }
              } catch (error) {
                console.error('Xatolik yuz berdi:', error);
              }
            }
          }
        } else {
          ctx.reply('Matn bo\'sh bo\'lishi mumkin emas!');
        }
      }
    }

    private stopSending(ctx): void {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === this.admin1Id || this.userId === this.admin2Id || this.userId === this.admin3Id) {
        clearInterval(this.interval);
        this.interval = null;
        this.isSending = true;
        this.isText = false;
        this.savedText = null;
      }
    }

    private handleDeleteButton(ctx): void {
      this.userId = ctx.message.from.id.toString();
      if (this.userId === this.admin1Id || this.userId === this.admin2Id || this.userId === this.admin3Id) {

      ctx.reply("🏁 Reklama o'chirildi ‼️");
      this.stopSending(ctx);
      }
    }

    private async handleCountButton(ctx): Promise<void> {
      this.userId = ctx.message.from.id.toString();
      const users = await this.userRepository.find();
      
      if (this.userId === this.admin1Id || this.userId === this.admin2Id || this.userId === this.admin3Id) {
        if (users && users.length > 0) {
          ctx.reply(`🙍‍♂️ Foydalanuvchilar soni:  ${users.length} ta`);
        } else {
          ctx.reply("🙍‍♂️ Foydalanuvchilar topilmadi!");
        }
      }
    }

    private async sendTextOnce(ctx): Promise<void> {
      this.userId = ctx.message.from.id.toString();
      const isAdmin = this.userId === this.admin1Id || this.userId === this.admin2Id || this.userId === this.admin3Id;
      if (isAdmin || !this.isText) {
        if (isAdmin) {
          const newMessage = new Message();
          newMessage.from_id = this.userId;
          newMessage.message_id = ctx.message.message_id.toString();
          newMessage.message_text = ctx.message.text.toString();

          await this.messageRepository.save(newMessage);
        }
    
        if (isAdmin) {
          const users = await this.userRepository.find();
          const message = await this.messageRepository.find();

          for (const user of users) {
            if (user.from_id !== this.userId) {
              try {
                const chatMember = await ctx.telegram.getChatMember(user.chat_id, user.from_id);
                
                if (chatMember && chatMember.status !== 'left' && chatMember.status !== 'kicked') {
                  try {
                    await ctx.telegram.sendMessage(user.from_id, this.adText);
                  } catch (error) {
                    continue;
                  }
                }
              } catch (error) {
                console.error('Xatolik yuz berdi:', error);
              }
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
      if (this.userId === this.admin1Id || this.userId === this.admin2Id || this.userId === this.admin3Id) {
      const text = ctx.message.text;
      if (text === "🏁 REKLAMA") {
          this.handleReklamaButton(ctx);
        }else if (text === "🙍‍♂️ F0YDALANUVCHILAR SONI") {
          this.handleCountButton(ctx)
        } else if (text === "🏘 BOSH SAHIFA") {
          this.handleHomeButton(ctx);
        }else if (text === "➕ QO'SHISH") {
            this.handleAddButton(ctx);
        } else if (text === "❌ O'CHIRISH") {
          this.handleDeleteButton(ctx);
        } else if (text === "⬅️ ORQAGA") {
          this.handleBackButton(ctx);
        } else {
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