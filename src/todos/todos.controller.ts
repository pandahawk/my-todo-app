import { Controller, Get } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './interfaces/todo.interface';

@Controller('todos')
export class TodosController {
  private readonly todoService: TodosService;

  constructor(todoService: TodosService) {
    this.todoService = todoService;
  }

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }
}
