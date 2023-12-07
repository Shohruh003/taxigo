import { Controller,HttpCode, HttpStatus, Post,Body,Get } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
      ) {}

      @Get()
      @HttpCode(HttpStatus.OK)
      async getAll() {
        const message = await this.messageService.findAll();
          return message;
      }


      @Post()
      @HttpCode(HttpStatus.CREATED)
      async create(@Body() data: CreateMessageDto) {
        const message = await this.messageService.createMessage(data);
        return message;
      }
}
