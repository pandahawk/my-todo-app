import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TodoParamsDto } from './dto/todo-params.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from '@entities/todo.entity';

@Controller('todos')
@ApiTags('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all todos"' })
  @ApiResponse({
    status: 200,
    description:
      'Returns a JSON array of todo objects. Each todo object contains the following properties: ID (int), task (string), and completed (boolean).',
    type: [Todo],
  })
  async findAll() {
    return await this.todosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID (int) of the todo to retrieve.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the requested todo object, including its id (int), task (string), and completed (boolean) properties.',
    type: [Todo],
  })
  async findOne(@Param() params: TodoParamsDto) {
    console.log(params)
    return this.todosService.findOne(+params.id);
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
      'Returns the newly created todo object, including its generated id (int), the provided task (string), and completed (boolean, defaults to false).',
    type: Todo,
  })
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todosService.create(createTodoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo by ID' })
  @ApiParam({
    name: 'id',
    description: 'The id (int) of the todo to update.',
  })
  @ApiBody({
    description:
      'A JSON object representing the updates to the todo.  The task (string) and completed (boolean) properties are optional.  Only include the properties you wish to update.',
    type: UpdateTodoDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the updated todo object, including its id (int), task (string), and completed (boolean) properties.',
    type: [Todo],
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    const params: TodoParamsDto = { id };
    return this.todosService.update(params.id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by ID' })
  @ApiParam({
    name: 'id',
    description: 'The id (int) of the todo to delete.',
  })
  @ApiResponse({
    status: 204,
    description: 'Returns a 204 No Content indicating successful deletion.',
    type: undefined,
  })
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const params: TodoParamsDto = { id };
    await this.todosService.remove(params.id);
  }
}
