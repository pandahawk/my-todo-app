import { TestingModule, Test } from '@nestjs/testing';
import { CreateTodoDto } from '@todos/dto/create-todo.dto';
import { TodosService } from '@todos/todos.service';
import { Todo } from '@todos/interfaces/todo.interface';
import { TodoNotFoundException } from '@exceptions/todo-not-found.exception';
import { UpdateTodoDto } from '@todos/dto/update-todo.dto';
import { randomUUID } from 'crypto';
import { TodoParamsDto } from '@todos/dto/todo-params.dto';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService],
    }).compile();

    service = module.get<TodosService>(TodosService);
    service.initializeTodos();
  });

  describe('create', () => {
    it('should create a new todo with a v4 random UUID', () => {
      const createTodoDto: CreateTodoDto = { task: 'Buy groceries' };

      const newTodo = service.create(createTodoDto);

      expect(newTodo).toBeDefined();
      expect(newTodo.id).toBeDefined(); // Check that an ID is generated
      expect(typeof newTodo.id).toBe('string'); // Check that the ID is a string
      expect(newTodo.task).toBe('Buy groceries');
      expect(newTodo.completed).toBe(false);
      expect(newTodo.id).toMatch(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      );
    });

    it('create two todos with different unique UUIDs', () => {
      const createTodoDto1: CreateTodoDto = { task: 'Buy groceries' };
      const createTodoDto2: CreateTodoDto = { task: 'Play with Caleb' };

      const newTodo1 = service.create(createTodoDto1);
      const newTodo2 = service.create(createTodoDto2);

      expect(newTodo1).toBeDefined();
      expect(newTodo1.id).toBeDefined(); // Check that an ID is generated
      expect(typeof newTodo1.id).toBe('string'); // Check that the ID is a string
      expect(newTodo1.task).toBe('Buy groceries');
      expect(newTodo1.completed).toBeFalsy();

      expect(newTodo2).toBeDefined();
      expect(newTodo2.id).toBeDefined(); // Check that an ID is generated
      expect(typeof newTodo2.id).toBe('string'); // Check that the ID is a string
      expect(newTodo2.task).toBe('Play with Caleb');
      expect(newTodo2.completed).toBeFalsy();

      expect(newTodo1.id).not.toBe(newTodo2.id);
    });
  });

  describe('read', () => {
    it('should return all todos', () => {
      const todos = service.findAll();
      expect(todos).toBeDefined();
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBeGreaterThan(0); // Assuming initializeTodos adds some initial todos
    });

    it('should the todo with the given id', () => {
      const mockTodo: Todo = {
        id: randomUUID(),
        task: 'Test Task',
        completed: false,
      };

      const paramsDto: TodoParamsDto = { id: mockTodo.id };

      service.addTodoForTesting(mockTodo);
      const todoFound = service.findOne(paramsDto.id);

      expect(todoFound).toBeDefined();
      expect(todoFound.id).toBe(mockTodo.id);
      expect(todoFound.completed).toBe(mockTodo.completed);
      expect(todoFound.task).toEqual(mockTodo.task);
    });

    it('should throw a TodoNotfoundException if id not found', () => {
      const paramsDto: TodoParamsDto = { id: 'invalid-id' };

      expect(() => service.findOne(paramsDto.id)).toThrow(
        TodoNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update task of the mockTodo', () => {
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
      service.addTodoForTesting(mockTodo);

      const updatedTodo = service.update(paramsDto.id, updateDTO);

      expect(updatedTodo.id).toEqual(mockTodo.id);
      expect(updatedTodo.completed).toEqual(mockTodo.completed);
      expect(updatedTodo.task).toBe('updated Task');
    });

    it('should update the state of the mockTodo', () => {
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
      service.addTodoForTesting(mockTodo);

      const updatedTodo = service.update(paramsDto.id, updateDTO);

      expect(updatedTodo.id).toEqual(mockTodo.id);
      expect(updatedTodo.task).toEqual(mockTodo.task);
      expect(updatedTodo.completed).toBeTruthy();
    });

    it('should not update the mockTodo when no updated values are provided', () => {
      const mockTodo: Todo = {
        id: randomUUID(),
        task: 'Test Task',
        completed: false,
      };
      const paramsDto: TodoParamsDto = { id: mockTodo.id };
      const updateDTO: UpdateTodoDto = {
        task: undefined,
        completed: undefined,
      };
      service.addTodoForTesting(mockTodo);

      const updatedTodo = service.update(paramsDto.id, updateDTO);

      expect(updatedTodo).toEqual(mockTodo);
    });

    it('should throw a TodoNotFoundException for non existing id', () => {
      const paramsDto: TodoParamsDto = {
        id: '00000000-0000-0000-0000-000000000000',
      };
      const updateDTO: UpdateTodoDto = {
        task: undefined,
        completed: undefined,
      };
      expect(() => service.update(paramsDto.id, updateDTO)).toThrow(
        TodoNotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the mockTodo from service', () => {
      const mockTodo: Todo = {
        id: randomUUID(),
        task: 'Test Task',
        completed: false,
      };
      const paramsDto: TodoParamsDto = { id: mockTodo.id };

      service.addTodoForTesting(mockTodo);

      const numberTodosBefore = service.findAll().length;

      expect(service.findOne(paramsDto.id)).toStrictEqual(mockTodo);

      service.remove(paramsDto.id);

      const numberTodosAfter = service.findAll().length;

      expect(() => service.findOne(paramsDto.id)).toThrow(
        TodoNotFoundException,
      );
      expect(numberTodosAfter).toBe(numberTodosBefore - 1);
    });

    it('should throw TodoNotFoundException and not modify the remaining todos if the given id is not found', () => {
      const paramsDto: TodoParamsDto = { id: 'invalid' };
      const numberTodosBefore = service.findAll().length;

      expect(() => service.remove(paramsDto.id)).toThrow(TodoNotFoundException);

      const numberTodosAfter = service.findAll().length;
      expect(numberTodosAfter).toEqual(numberTodosBefore);
    });
  });
});
