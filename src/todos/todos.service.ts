import { Injectable } from '@nestjs/common';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoNotFoundException } from '../exceptions/todo-not-found.exception';

//use DTO pattern to handle data validation in TodosController
@Injectable()
export class TodosService {
  private idCounter = 100;
  private todos: Todo[] = [];

  /*   constructor() {
    this.todos = [
      { id: this.generateId(), task: 'Buy groceries', completed: false },
      { id: this.generateId(), task: 'Walk the dog', completed: true },
      { id: this.generateId(), task: 'Pay bills', completed: false },
    ];
  } */

  private generateId(): number {
    return ++this.idCounter;
  }

  create(todo: CreateTodoDto): Todo | undefined {
    const newTodo: Todo = { ...todo, id: this.generateId(), completed: false };
    this.todos.push(newTodo);
    return newTodo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new TodoNotFoundException(id);
    }
    return todo;
  }

  remove(id: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }
}
