import { IsUUID } from 'class-validator';

export class RemoveTodoDto {
  @IsUUID('4')
  id: string;
}
