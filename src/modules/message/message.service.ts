import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
      ) {}
    
      findAll() {
        return this.messageRepository.find();
      }
    
      async createMessage(data: CreateMessageDto){
        const message = this.messageRepository.create();
        message.message_id = data.message_id;
        message.from_id = data.from_id;
        message.message_text = data.message_text;
        await this.messageRepository.save(message);
        return message;
      }

      async delete(from_id: string) {
        await this.messageRepository.delete({ from_id });
      }
}
