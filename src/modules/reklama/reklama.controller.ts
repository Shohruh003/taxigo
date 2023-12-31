import { Controller, HttpCode, HttpStatus, Post,Body,Get,Delete,Param } from '@nestjs/common';
import { ReklamaService } from './reklama.service';
import { CreateReklamaDto } from './dto/create-reklama.dto';

@Controller('reklama')
export class ReklamaController {
    constructor(
        private readonly reklamaService: ReklamaService,
      ) {}

      @Get()
      @HttpCode(HttpStatus.OK)
      async getAll() {
        const reklama = await this.reklamaService.findAll();
          return reklama;
      }


      @Post()
      @HttpCode(HttpStatus.CREATED)
      async create(@Body() data: CreateReklamaDto) {
        const reklama = await this.reklamaService.createReklama(data);
        return reklama;
      }

      @Delete(':from_id')
      @HttpCode(HttpStatus.NO_CONTENT)
      async delete(@Param('from_id') from_id: string) {
        await this.reklamaService.delete(from_id);
      }
}
