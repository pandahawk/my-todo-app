import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './interfaces/todo.interface';
import { FindOneTodoDto } from './dto/find-one-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
@UsePipes(ValidationPipe)
export class TodosController {
  private readonly todosService: TodosService;

  constructor(todoService: TodosService) {
    this.todosService = todoService;
  }

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo | undefined> {
    const findOneTodoDto: FindOneTodoDto = { id };
    return this.todosService.findOne(findOneTodoDto);
  }

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }
}
