import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from '../../src/todos/todos.controller';
import { TodosService } from '../../src/todos/todos.service';

jest.mock('../../src/todos/todos.service');

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [TodosService],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
