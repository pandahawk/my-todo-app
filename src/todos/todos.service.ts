import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoNotFoundException } from '@exceptions/todo-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from '@entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  private readonly todos: Todo[] = [];

  clearForTesting() {
    this.todos.length = 0;
  }

  // initializeTodos() {
  //   this.todos.push(
  //     {
  //       id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  //       task: 'Buy groceries',
  //       completed: false,
  //     },
  //     {
  //       id: '1aa8885b-6c71-4649-b541-017498c92a98',
  //       task: 'Walk the dog',
  //       completed: true,
  //     },
  //     {
  //       id: 'a7b8c9d0-1e2f-4345-8679-0123456789ab',
  //       task: 'Pay bills',
  //       completed: false,
  //     },
  //   );
  // }

  addTodoForTesting(todo: Todo) {
    this.todos.push(todo);
  }

  async create(dto: CreateTodoDto) {
    const newTodo = this.todosRepository.create(dto);
    return await this.todosRepository.save(newTodo);
  }

  async findAll() {
    return await this.todosRepository.find();
  }

  async findOne(id: number) {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      throw new TodoNotFoundException(id);
    }
    return todo;
  }

  async remove(id: number) {
    const result = await this.todosRepository.delete(id);
    if (result.affected === 0) {
      throw new TodoNotFoundException(id);
    }
  }

  async update(id: number, dto: UpdateTodoDto) {

    const hasValuesToUpdate = Object.keys(dto).length > 0;

    if (!hasValuesToUpdate) {
      return await this.findOne(id);
    }

    const result = await this.todosRepository.update(id, dto);
    if (result.affected === 0) {
      throw new TodoNotFoundException(id);
    }
    return await this.findOne(id);
  }
}
