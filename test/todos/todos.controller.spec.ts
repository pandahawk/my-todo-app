import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { TodosController } from '@todos/todos.controller';
import { TodosService } from '@todos/todos.service';
import { Todo } from '@todos/interfaces/todo.interface';
import { FindOneTodoDto } from '@todos/dto/find-one-todo.dto';

import { CreateTodoDto } from '@todos/dto/create-todo.dto';
import { UpdateTodoDto } from '@todos/dto/update-todo.dto';
import { TodoNotFoundException } from '@exceptions/todo-not-found.exception';

jest.mock('@todos/todos.service');

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

  describe('findById', () => {
    it('should return the todo with the search id', async () => {
      const searchId = randomUUID();
      const mockTodo: Todo = {
        id: searchId,
        task: 'test task',
        completed: false,
      };
      const dto: FindOneTodoDto = { id: searchId };
      jest.spyOn(mockService, 'findById').mockReturnValue(mockTodo);

      const result = await controller.findById(searchId);

      expect(result).toEqual(mockTodo);
      expect(mockService.findById).toHaveBeenCalledWith(dto);
    });

    it('should reject the promise when todo is not found', async () => {
      const searchId = randomUUID();
      const dto: FindOneTodoDto = { id: searchId };
      jest.spyOn(mockService, 'findById').mockImplementation(() => {
        throw new TodoNotFoundException(searchId);
      });

      const result = controller.findById(searchId);

      expect(result).rejects.toThrow(new TodoNotFoundException(searchId));
      expect(mockService.findById).toHaveBeenCalledWith(dto);
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

  describe('update', () => {
    it('should update the task of a mockTodo', async () => {
      const idToUpdate = randomUUID();
      const initialTodo: Todo = {
        id: idToUpdate,
        task: 'test task',
        completed: false,
      };
      const updateDto: UpdateTodoDto = { task: 'updated task' };
      const updatedTodo: Todo = {
        id: idToUpdate,
        task: updateDto.task,
        completed: false,
      };
      jest.spyOn(mockService, 'findById').mockReturnValue(initialTodo);

      const foundTodo = await controller.findById(idToUpdate);

      expect(foundTodo).toEqual(initialTodo);

      jest.spyOn(mockService, 'updateById').mockReturnValue(updatedTodo);

      const result = await controller.updateById(idToUpdate, updateDto);

      expect(mockService.updateById).toHaveBeenCalledWith(
        { id: idToUpdate },
        updateDto,
      );
      expect(result).toEqual(updatedTodo);
      expect(result.id).toEqual(foundTodo.id);
    });

    it('should update the completion state of a mockTodo', async () => {
      const idToUpdate = randomUUID();
      const initialTodo: Todo = {
        id: idToUpdate,
        task: 'test task',
        completed: false,
      };
      const updateDto: UpdateTodoDto = { completed: true };
      const updatedTodo: Todo = {
        id: idToUpdate,
        task: 'test task',
        completed: updateDto.completed,
      };
      jest.spyOn(mockService, 'findById').mockReturnValue(initialTodo);

      const foundTodo = await controller.findById(idToUpdate);

      expect(foundTodo).toEqual(initialTodo);

      jest.spyOn(mockService, 'updateById').mockReturnValue(updatedTodo);

      const result = await controller.updateById(idToUpdate, updateDto);

      expect(mockService.updateById).toHaveBeenCalledWith(
        { id: idToUpdate },
        updateDto,
      );
      expect(result).toEqual(updatedTodo);
      expect(result.id).toEqual(foundTodo.id);
    });
    it('should not update the mockTodo if no task and completion is passed', async () => {
      const idToUpdate = randomUUID();
      const initialTodo: Todo = {
        id: idToUpdate,
        task: 'test task',
        completed: false,
      };
      const updateDto: UpdateTodoDto = {};
      const updatedTodo: Todo = {
        id: idToUpdate,
        task: 'test task',
        completed: false,
      };
      jest.spyOn(mockService, 'findById').mockReturnValue(initialTodo);

      const foundTodo = await controller.findById(idToUpdate);

      expect(foundTodo).toEqual(initialTodo);

      jest.spyOn(mockService, 'updateById').mockReturnValue(updatedTodo);

      const result = await controller.updateById(idToUpdate, updateDto);

      expect(mockService.updateById).toHaveBeenCalledWith(
        { id: idToUpdate },
        updateDto,
      );
      expect(result).toEqual(updatedTodo);
      expect(result.id).toEqual(foundTodo.id);
    });
  });

  describe('delete', () => {
    it('should delete the mockTodo by id', async () => {
      const idToRemove = randomUUID();
      const mockTodo: Todo = {
        id: idToRemove,
        task: 'test task',
        completed: false,
      };

      jest.spyOn(mockService, 'findById').mockReturnValueOnce(mockTodo);

      const foundTodo = await controller.findById(idToRemove);
      expect(foundTodo).toEqual(mockTodo);

      await controller.removeById(idToRemove);

      jest.spyOn(mockService, 'findById').mockImplementation(() => {
        throw new TodoNotFoundException(idToRemove);
      });

      await expect(controller.findById(idToRemove)).rejects.toThrow(
        new TodoNotFoundException(idToRemove),
      );
    });

    it('should foward the TodoNotFoundException if Todo was not found', async () => {
      const idToRemove = randomUUID();
      const expectedErrorMessage = `Todo with ID ${idToRemove} not found`;

      jest.spyOn(mockService, 'removeById').mockImplementation(() => {
        throw new TodoNotFoundException(idToRemove);
      });
      await expect(controller.removeById(idToRemove)).rejects.toThrow(
        new TodoNotFoundException(idToRemove),
      );

      await expect(controller.removeById(idToRemove)).rejects.toHaveProperty(
        'message',
        expectedErrorMessage,
      );
    });
  });
});
