import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './interfaces/todo.interface';
import { FindOneTodoDto } from './dto/find-one-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TodoDto } from './dto/todo.dto';

@Controller('todos')
@ApiTags('todos')
@UsePipes(ValidationPipe)
export class TodosController {
  private readonly todosService: TodosService;

  constructor(todoService: TodosService) {
    this.todosService = todoService;
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of todos',
    type: [TodoDto],
  })
  async findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Todo | undefined> {
    const findOneTodoDto: FindOneTodoDto = { id };
    return this.todosService.findById(findOneTodoDto);
  }

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.updateById({ id: id }, updateTodoDto);
  }

  @Delete(':id')
  async removeById(@Param('id') id: string): Promise<void> {
    this.todosService.removeById({ id: id });
  }
}
