import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reklama } from './reklama.entity';
import { Repository } from 'typeorm';
import { CreateReklamaDto } from './dto/create-reklama.dto';

@Injectable()
export class ReklamaService {
    constructor(
        @InjectRepository(Reklama)
        private readonly reklamaRepository: Repository<Reklama>,
      ) {}
    
      findAll() {
        return this.reklamaRepository.find();
      }
    
      async createReklama(data: CreateReklamaDto){
        const reklama = this.reklamaRepository.create();
        reklama.message_id = data.message_id;
        reklama.from_id = data.from_id;
        reklama.message_text = data.message_text;
          console.log(reklama);
        await this.reklamaRepository.save(reklama);
        return reklama;
      }

      async delete(from_id: string) {
        await this.reklamaRepository.delete({ from_id });
      }
}
