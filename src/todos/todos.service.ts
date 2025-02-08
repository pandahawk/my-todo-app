import { Injectable } from '@nestjs/common';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoNotFoundException } from '../exceptions/todo-not-found.exception';

@Injectable()
export class TodosService {
  private idCounter = 100;
  private readonly todos: Todo[] = [];

  constructor() {
    this.todos = [
      { id: this.generateId(), task: 'Buy groceries', completed: false },
      { id: this.generateId(), task: 'Walk the dog', completed: true },
      { id: this.generateId(), task: 'Pay bills', completed: false },
    ];
  }

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

  find(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new TodoNotFoundException(id);
    }
    return todo;
  }
}
