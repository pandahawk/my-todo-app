import { TestingModule, Test } from '@nestjs/testing';
import { CreateTodoDto } from '@todos/dto/create-todo.dto';
import { TodosService } from '@todos/todos.service';
import { TodoNotFoundException } from '@exceptions/todo-not-found.exception';
import { randomUUID } from 'crypto';
import { TodoParamsDto } from '@todos/dto/todo-params.dto';
import { Todo } from '@entities/todo.entity';
import { DeleteResult, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateTodoDto } from '@todos/dto/update-todo.dto';

describe('TodosService', () => {
  let service: TodosService;
  let todosRepository: Partial<jest.Mocked<Repository<Todo>>>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as Partial<jest.Mocked<Repository<Todo>>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    todosRepository = mockRepository;
    service.initializeTodos();
  });

  describe('create', () => {
    it('should create a new todo with a v4 random UUID', async () => {
      const createTodoDto: CreateTodoDto = { task: 'Buy groceries' };

      todosRepository.save.mockImplementation((todo:Todo) => {
        return Promise.resolve(todo);
      });

      todosRepository.create.mockImplementation((dto: CreateTodoDto) => {
        return { id: randomUUID(), task: dto.task, completed: false };
      });

      const newTodo = await service.create(createTodoDto);

      expect(todosRepository.create).toHaveBeenCalledWith(createTodoDto);
      expect(newTodo).toBeDefined();
      expect(newTodo.id).toBeDefined(); // Check that an ID is generated
      expect(typeof newTodo.id).toBe('string'); // Check that the ID is a string
      expect(newTodo.task).toBe('Buy groceries');
      expect(newTodo.completed).toBe(false);
      expect(newTodo.id).toMatch(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      );
    });

    it('create two todos with different unique UUIDs', async () => {
      const createTodoDto1: CreateTodoDto = { task: 'Buy groceries' };
      const createTodoDto2: CreateTodoDto = { task: 'Play with Caleb' };

      todosRepository.save.mockImplementation((todo:Todo) => {
        return Promise.resolve(todo);
      });

      todosRepository.create.mockImplementation((dto: CreateTodoDto) => {
        return { id: randomUUID(), task: dto.task, completed: false };
      });


      const newTodo1 = await service.create(createTodoDto1);

      expect(newTodo1).toBeDefined();
      expect(newTodo1.id).toBeDefined(); // Check that an ID is generated
      expect(typeof newTodo1.id).toBe('string'); // Check that the ID is a string
      expect(newTodo1.task).toBe('Buy groceries');
      expect(newTodo1.completed).toBeFalsy();
      expect(todosRepository.create).toHaveBeenCalledWith(createTodoDto1);

      const newTodo2 = await service.create(createTodoDto2);

      expect(newTodo2).toBeDefined();
      expect(newTodo2.id).toBeDefined(); // Check that an ID is generated
      expect(typeof newTodo2.id).toBe('string'); // Check that the ID is a string
      expect(newTodo2.task).toBe('Play with Caleb');
      expect(newTodo2.completed).toBeFalsy();
      expect(todosRepository.create).toHaveBeenCalledWith(createTodoDto2);

      expect(newTodo1.id).not.toBe(newTodo2.id);
    });
  });

  describe('read', () => {
    it('should return all todos', async () => {
      const mockTodos: Todo[] = [
        { id: '1', task: 'Task 1', completed: false },
        { id: '2', task: 'Task 2', completed: true },
      ];

      jest.spyOn(todosRepository, 'find').mockResolvedValue(mockTodos);

      const todos = await service.findAll();

      expect(todosRepository.find).toHaveBeenCalled(); // Check if find was called
      expect(todos).toEqual(mockTodos); // Check if the returned todos match the mock data
    });

    it('should the todo with the given id', async () => {
      const mockTodo: Todo = {
        id: randomUUID(),
        task: 'Test Task',
        completed: false,
      };

      jest.spyOn(todosRepository, 'findOne').mockResolvedValue(mockTodo);

      const paramsDto: TodoParamsDto = { id: mockTodo.id };

      // service.addTodoForTesting(mockTodo);
      const todoFound = await service.findOne(paramsDto.id);

      expect(todoFound).toBeDefined();
      expect(todoFound.id).toBe(mockTodo.id);
      expect(todoFound.completed).toBe(mockTodo.completed);
      expect(todoFound.task).toEqual(mockTodo.task);
    });

    it('should throw a TodoNotfoundException if id not found', async () => {
      const paramsDto: TodoParamsDto = { id: randomUUID() };

      todosRepository.findOne.mockImplementation(() => {
        throw new TodoNotFoundException(paramsDto.id);
      });

      await expect(service.findOne(paramsDto.id)).rejects.toThrow(
        new TodoNotFoundException(paramsDto.id),
      );
    });
  });

  describe('update', () => {
    it('should update task of the mockTodo', async () => {
      const mockTodo: Todo = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        task: 'Test Task',
        completed: false,
      };
      const paramsDto: TodoParamsDto = { id: mockTodo.id };
      const updateDTO: UpdateTodoDto = {
        task: 'updated Task',
        completed: false,
      };

      const expected: Todo = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        task: 'updated Task',
        completed: false,
      };

      todosRepository.update.mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: [],
      });
      todosRepository.findOne.mockResolvedValue(expected);

      const updatedTodo = await service.update(paramsDto.id, updateDTO);

      expect(updatedTodo.id).toEqual(expected.id);
      expect(updatedTodo.completed).toEqual(expected.completed);
      expect(updatedTodo.task).toBe(expected.task);
    });

    it('should update the state of the mockTodo', async () => {
      const mockTodo: Todo = {
        id: randomUUID(),
        task: 'Test Task',
        completed: false,
      };
      const paramsDto: TodoParamsDto = { id: mockTodo.id };
      const updateDTO: UpdateTodoDto = {
        task: undefined,
        completed: true,
      };

      const expected: Todo = { ...mockTodo, completed: updateDTO.completed };

      todosRepository.update.mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: [],
      });
      todosRepository.findOne.mockResolvedValue(expected);

      const result = await service.update(paramsDto.id, updateDTO);

      expect(result.id).toEqual(mockTodo.id);
      expect(result.task).toEqual(mockTodo.task);
      expect(result.completed).toBeTruthy();
    });

    it('should not update the mockTodo when no updated values are provided', async () => {
      const mockTodo: Todo = {
        id: randomUUID(),
        task: 'Test Task',
        completed: false,
      };
      const paramsDto: TodoParamsDto = { id: mockTodo.id };
      const updateDTO: UpdateTodoDto = {};

      todosRepository.findOne.mockResolvedValue(mockTodo);

      const result = await service.update(paramsDto.id, updateDTO);

      expect(result).toEqual(mockTodo);
    });

    it('should throw a TodoNotFoundException for non existing id', async () => {
      const paramsDto: TodoParamsDto = {
        id: '00000000-0000-0000-0000-000000000000',
      };
      const updateDTO: UpdateTodoDto = {};

      todosRepository.update.mockResolvedValue({
        affected: 0,
        generatedMaps: [],
        raw: [],
      });

      await expect(service.update(paramsDto.id, updateDTO)).rejects.toThrow(
        new TodoNotFoundException(paramsDto.id),
      );
    });
  });

  describe('delete', () => {
    it('should delete the mockTodo from service', async () => {
      const mockTodo1: Todo = {
        id: randomUUID(),
        task: 'Test Task',
        completed: false,
      };
      const mockTodo2: Todo = {
        id: randomUUID(),
        task: 'Test Task',
        completed: false,
      };

      const paramsDto: TodoParamsDto = { id: mockTodo1.id };

      todosRepository.find.mockResolvedValueOnce([mockTodo1, mockTodo2]);
      todosRepository.delete.mockResolvedValue({ affected: 1, raw: [] });

      const numberTodosBefore = (await service.findAll()).length;

      const result = await service.remove(mockTodo1.id);

      todosRepository.find.mockResolvedValueOnce([mockTodo2]);

      const numberTodosAfter = (await service.findAll()).length;

      expect(numberTodosAfter).toBe(numberTodosBefore - 1);
      expect(todosRepository.find).toHaveBeenCalledTimes(2);
      expect(todosRepository.delete).toHaveBeenCalled();
    });

    it('should throw TodoNotFoundException and not modify the remaining todos if the given id is not found', async () => {
      const mockTodo: Todo = {
        id: randomUUID(),
        task: 'Test Task',
        completed: false,
      };
      const paramsDto: TodoParamsDto = { id: randomUUID() };

      todosRepository.find.mockResolvedValue([mockTodo]);
      todosRepository.delete.mockResolvedValue({ affected: 0, raw: [] });

      const numberTodosBefore = (await service.findAll()).length;

      await expect(service.remove(paramsDto.id)).rejects.toThrow(
        new TodoNotFoundException(paramsDto.id),
      );

      const numberTodosAfter = (await service.findAll()).length;

      expect(numberTodosAfter).toEqual(numberTodosBefore);
      expect(todosRepository.find).toHaveBeenCalledTimes(2);
      expect(todosRepository.delete).toHaveBeenCalled();
    });
  });
});
