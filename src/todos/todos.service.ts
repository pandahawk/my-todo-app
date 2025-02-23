import { Injectable, OnModuleInit } from '@nestjs/common';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { randomUUID } from 'crypto';
import { TodoNotFoundException } from '@exceptions/todo-not-found.exception';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService implements OnModuleInit {
  onModuleInit() {
    this.initializeTodos();
  }
  private readonly todos: Todo[] = [];

  clearForTesting() {
    this.todos.length = 0;
  }

  initializeTodos() {
    this.todos.push(
      {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        task: 'Buy groceries',
        completed: false,
      },
      {
        id: '1aa8885b-6c71-4649-b541-017498c92a98',
        task: 'Walk the dog',
        completed: true,
      },
      {
        id: 'a7b8c9d0-1e2f-4345-8679-0123456789ab',
        task: 'Pay bills',
        completed: false,
      },
    );
  }

  addTodoForTesting(todo: Todo) {
    this.todos.push(todo);
  }

  create(dto: CreateTodoDto) {
    const newTodo: Todo = {
      ...dto,
      id: randomUUID(),
      completed: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  findAll() {
    return this.todos;
  }

  findOne(id: string) {
    const todoFound = this.todos.find((todo) => todo.id === id);
    if (!todoFound) {
      throw new TodoNotFoundException(id);
    }
    return todoFound;
  }

  remove(id: string) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new TodoNotFoundException(id);
    }
    const newTodos = this.todos.filter((todo) => todo.id !== id);
    (this as any).todos = newTodos;
  }

  update(id: string, updateTodoDTO: UpdateTodoDto): Todo {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new TodoNotFoundException(id);
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
