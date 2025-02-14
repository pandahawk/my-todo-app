import { IsUUID } from 'class-validator';

export class FindOneTodoDto {
  @IsUUID('4')
  id: string;
}
