import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './filter/http-axception.filter';
import { ConfigService } from '@nestjs/config';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter())

  const config = app.get(ConfigService)
  const port = config.getOrThrow<number>('app.port')
  const host = config.getOrThrow<string>('app.host')

  await app.listen(port, host);
}
bootstrap();
