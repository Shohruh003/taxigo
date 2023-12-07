import { IsNotEmpty } from 'class-validator';

export class CreateReklamaDto {

  @IsNotEmpty()
  message_id: string;

  @IsNotEmpty()
  from_id: string;
}
