import { Controller } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  private readonly todoService: TodosService;

  constructor(todoService: TodosService) {
    this.todoService = todoService;
  }

  /*   @Get()
  async findAll(): Promise<Todo[]> {
    return await this.todoService.findAll();
  } */
}
