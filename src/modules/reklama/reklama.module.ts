import { Module } from '@nestjs/common';
import { ReklamaService } from './reklama.service';
import { ReklamaController } from './reklama.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reklama } from './reklama.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reklama])
  ],
  providers: [ReklamaService],
  controllers: [ReklamaController]
})
export class ReklamaModule {}
