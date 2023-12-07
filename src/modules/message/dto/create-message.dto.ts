import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {

  @IsNotEmpty()
  message_id: string;

  @IsNotEmpty()
  from_id: string;
}
