import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoNotFoundException } from '@exceptions/todo-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from '@entities/todo.entity';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  async create(dto: CreateTodoDto) {
    const newTodo = this.todosRepository.create(dto);
    return await this.todosRepository.save(newTodo);
  }

  async findAll() {
    // for (let i = 0; i < 10; i++) {
    //   this.logger.log(`Fibonacci call nr.${i + 1}`);
    //   await new Promise((resolve) => {
    //     process.nextTick(() => {
    //       this.calculateFibonacci(40);
    //       setTimeout(resolve, 200);
    //     });
    //   });
    // }
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

  // private calculateFibonacci(n: number): number {
  //   if (n <= 1) {
  //     return n;
  //   }
  //   return this.calculateFibonacci(n - 1) + this.calculateFibonacci(n - 2);
  // }
}
