import { IsUUID } from 'class-validator';

export class UpdateTodoParams {
  @IsUUID('4')
  id: string;
}
