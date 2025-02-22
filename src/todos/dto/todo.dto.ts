import { ApiProperty } from '@nestjs/swagger';
import { Todo as TodoInterface } from '../interfaces/todo.interface';

export class TodoDto implements TodoInterface {
  @ApiProperty({ description: 'The uuid of the todo' })
  id: string;

  @ApiProperty({ description: 'The task of the todo' })
  task: string;

  @ApiProperty({ description: 'Whether the todo is completed' })
  completed: boolean;
}
