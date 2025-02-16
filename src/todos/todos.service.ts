import { Injectable } from '@nestjs/common';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { randomUUID } from 'crypto';
import { TodoNotFoundException } from '../../src/exceptions/todo-not-found.exception';
import { FindOneTodoDto } from './dto/find-one-todo.dto';
import { RemoveTodoDto } from './dto/remove-todo.dto';
import { UpdateTodoParams } from './dto/update-todo-params.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  private readonly todos: Todo[] = [];

  initializeTodos() {
    this.todos.push(
      {
        id: randomUUID(),
        task: 'Buy groceries',
        completed: false,
      },
      {
        id: randomUUID(),
        task: 'Walk the dog',
        completed: true,
      },
      {
        id: randomUUID(),
        task: 'Pay bills',
        completed: false,
      },
    );
  }

  addTodoForTesting(todo: Todo) {
    this.todos.push(todo);
  }

  create(dto: CreateTodoDto): Todo | undefined {
    const newTodo: Todo = {
      ...dto,
      id: randomUUID(),
      completed: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(dto: FindOneTodoDto): Todo | undefined {
    const todoFound = this.todos.find((todo) => todo.id === dto.id);
    if (!todoFound) {
      throw new TodoNotFoundException(dto.id);
    }
    return todoFound;
  }

  removeById(removeOneDto: RemoveTodoDto) {
    const idToRemove = removeOneDto.id;
    const index = this.todos.findIndex((todo) => todo.id === idToRemove);
    if (index === -1) {
      throw new TodoNotFoundException(idToRemove);
    }
    const newTodos = this.todos.filter((todo) => todo.id !== idToRemove);
    (this as any).todos = newTodos;
  }

  updateById(
    updateTodoParams: UpdateTodoParams,
    updateTodoDTO: UpdateTodoDto,
  ): Todo {
    const idToUpdate = updateTodoParams.id;
    const index = this.todos.findIndex((todo) => todo.id === idToUpdate);
    if (index === -1) {
      throw new TodoNotFoundException(idToUpdate);
    }
    const updatedTodo = {
      ...this.todos[index],
      ...(updateTodoDTO.task !== undefined && { task: updateTodoDTO.task }),
      ...(updateTodoDTO.completed !== undefined && {
        completed: updateTodoDTO.completed,
      }),
    };

    const newTodos = this.todos.map((todo, i) =>
      i === index ? updatedTodo : todo,
    );

    (this as any).todos = newTodos;

    return updatedTodo;
  }
}
