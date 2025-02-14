import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from '../../src/todos/todos.controller';
import { TodosService } from '../../src/todos/todos.service';
import { randomUUID } from 'crypto';

jest.mock('../../src/todos/todos.service');

describe('TodosController', () => {
  let controller: TodosController;
  let mockService: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [TodosService],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    mockService = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a array of todos', async () => {
      const mockTodos = [
        { id: randomUUID(), task: 'task 1', completed: false },
        { id: randomUUID(), task: 'task 2', completed: false },
      ];

      (mockService.findAll as jest.Mock).mockReturnValue(mockTodos);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTodos);
    });
  });
});
