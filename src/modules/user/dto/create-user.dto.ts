import { IsNotEmpty } from 'class-validator';

export class CreateUsersDto {

  @IsNotEmpty()
  from_id: string;
}
