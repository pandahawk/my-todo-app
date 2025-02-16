import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { TodosController } from '../../src/todos/todos.controller';
import { TodosService } from '../../src/todos/todos.service';
import { Todo } from 'src/todos/interfaces/todo.interface';
import { FindOneTodoDto } from 'src/todos/dto/find-one-todo.dto';
import { TodoNotFoundException } from '../../src/exceptions/todo-not-found.exception';
import { CreateTodoDto } from 'src/todos/dto/create-todo.dto';
jest.mock('../../src/todos/todos.service');

describe('TodosController', () => {
  let controller: TodosController;
  let mockService: jest.Mocked<TodosService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [TodosService],
    }).compile();

    mockService = module.get(TodosService) as jest.Mocked<TodosService>;
    controller = module.get(TodosController);
    (TodosService as jest.Mock).mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const mockTodos = [
        { id: randomUUID(), task: 'task 1', completed: false },
        { id: randomUUID(), task: 'task 2', completed: false },
      ];
      jest.spyOn(mockService, 'findAll').mockImplementation(() => mockTodos);

      const result = await controller.findAll();

      expect(result).toEqual(mockTodos);
    });

    it('should return an empty array', async () => {
      const mockTodos = [];
      jest.spyOn(mockService, 'findAll').mockImplementation(() => []);

      const result = await controller.findAll();

      expect(result).toEqual(mockTodos);
    });
  });

  describe('findOne', () => {
    it('should return the todo with the search id', async () => {
      const searchId = randomUUID();
      const mockTodo: Todo = {
        id: searchId,
        task: 'test task',
        completed: false,
      };
      const dto: FindOneTodoDto = { id: searchId };
      jest.spyOn(mockService, 'findOne').mockReturnValue(mockTodo);

      const result = await controller.findOne(searchId);

      expect(result).toEqual(mockTodo);
      expect(mockService.findOne).toHaveBeenCalledWith(dto);
    });

    it('should reject the promise when todo is not found', async () => {
      const searchId = randomUUID();
      const dto: FindOneTodoDto = { id: searchId };
      jest.spyOn(mockService, 'findOne').mockImplementation(() => {
        throw new TodoNotFoundException(searchId);
      });

      const result = controller.findOne(searchId);

      expect(result).rejects.toThrow(new TodoNotFoundException(searchId));
      expect(mockService.findOne).toHaveBeenCalledWith(dto);
    });
  });

  describe('create', () => {
    it('should create a Todo', async () => {
      const mockTodo: Todo = {
        id: randomUUID(),
        task: 'test task',
        completed: false,
      };
      const createTodoDto: CreateTodoDto = { task: mockTodo.task };
      (mockService.create as jest.Mock).mockReturnValue(mockTodo);

      const result = await controller.create(createTodoDto);

      expect(result).toEqual(mockTodo);
      expect(mockService.create).toHaveBeenCalledWith(createTodoDto);
    });
  });
});

//   describe('create', () => {

//   // TODO: rewwrite those test with the new knowledge

//   // describe('create', () => {
//   //   it('should create a valid Todo', async () => {});
//   //   it('should create two valid Todos with different ids', async () => {});
//   // });

//   // afterEach(async () => {
//   //   await app.close();
//   // });
// });
