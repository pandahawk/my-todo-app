import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TodoDto } from './dto/todo.dto';
import { TodoParamsDto } from './dto/todo-params.dto';

@Controller('todos')
@ApiTags('todos')
@UsePipes(ValidationPipe)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all todos"' })
  @ApiResponse({
    status: 200,
    description:
      'Returns a JSON array of todo objects. Each todo object contains the following properties: id (UUID), task (string), and completed (boolean).',
    type: [TodoDto],
  })
  async findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiParam({
    name: 'id',
    description: 'The UUID (v4) of the todo to retrieve.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the requested todo object, including its id (UUID), task (string), and completed (boolean) properties.',
    type: [TodoDto],
  })
  async findOne(@Param() params: TodoParamsDto) {
    return this.todosService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBody({
    description:
      'A JSON object representing the new todo. The task property (string) is required.',
    type: CreateTodoDto,
  })
  @ApiResponse({
    status: 201,
    description:
      'Returns the newly created todo object, including its generated id (UUID), the provided task (string), and completed (boolean, defaults to false).',
    type: TodoDto,
  })
  async create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo by ID' })
  @ApiParam({
    name: 'id',
    description: 'The UUID (v4) of the todo to update.',
  })
  @ApiBody({
    description:
      'A JSON object representing the updates to the todo.  The task (string) and completed (boolean) properties are optional.  Only include the properties you wish to update.',
    type: UpdateTodoDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the updated todo object, including its id (UUID), task (string), and completed (boolean) properties.',
    type: [TodoDto],
  })
  async update(
    @Param() params: TodoParamsDto,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(params.id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by ID' })
  @ApiParam({
    name: 'id',
    description: 'The UUID (v4) of the todo to delete.',
  })
  @ApiResponse({
    status: 204,
    description: 'Returns a 204 No Content indicating successful deletion.',
    type: undefined,
  })
  @HttpCode(204)
  async remove(@Param() params: TodoParamsDto) {
    this.todosService.remove(params.id);
  }
}
