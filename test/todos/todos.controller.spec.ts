import { Test } from '@nestjs/testing';
import { TodosController } from '@todos/todos.controller';
import { TodosService } from '@todos/todos.service';

import { CreateTodoDto } from '@todos/dto/create-todo.dto';
import { UpdateTodoDto } from '@todos/dto/update-todo.dto';
import { TodoNotFoundException } from '@exceptions/todo-not-found.exception';
import { TodoParamsDto } from '@todos/dto/todo-params.dto';
import { Todo } from '@entities/todo.entity';

//jest.mock('@todos/todos.service');

describe('TodosController', () => {
  let controller: TodosController;
  let service: jest.Mocked<TodosService>;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as Partial<jest.Mocked<TodosService>>;

    const module = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService, // Provide the actual service
          useValue: mockService, // Use the mock object
        },
      ],
    }).compile();

    service = module.get(TodosService);
    controller = module.get(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const mockTodos = [
        { id: 1, task: 'task 1', completed: false },
        { id: 2, task: 'task 2', completed: false },
      ];

      service.findAll.mockResolvedValue(mockTodos);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTodos);
    });

    it('should return an empty array', async () => {
      const mockTodos = [];
      service.findAll.mockResolvedValue(mockTodos);

      const result = await controller.findAll();

      expect(result).toEqual(mockTodos);
    });
  });

  describe('findOne', () => {
    it('should return the todo with the search id', async () => {
      const searchId = 1;
      const mockTodo: Todo = {
        id: searchId,
        task: 'test task',
        completed: false,
      };
      const dto: TodoParamsDto = { id: searchId };
      service.findOne.mockResolvedValue(mockTodo);

      const result = await controller.findOne(dto);

      expect(result).toEqual(mockTodo);
      expect(service.findOne).toHaveBeenCalledWith(dto.id);
    });

    it('should reject the promise when todo is not found', async () => {
      const searchId = 1;
      const dto: TodoParamsDto = { id: searchId };

      service.findOne.mockImplementation(() => {
        return Promise.reject(new TodoNotFoundException(searchId));
      });

      const result =  controller.findOne(dto);

      await expect(result).rejects.toThrow(new TodoNotFoundException(searchId)); 
  expect(service.findOne).toHaveBeenCalledWith(dto.id);
    });
  });

    describe('create', () => {
      it('should create a Todo', async () => {
        const mockTodo: Todo = {
          id: 1,
          task: 'test task',
          completed: false,
        };
        const createTodoDto: CreateTodoDto = { task: mockTodo.task };
        
        service.create.mockResolvedValue(mockTodo);

        const result = await controller.create(createTodoDto);

        expect(result).toEqual(mockTodo);
        expect(service.create).toHaveBeenCalledWith(createTodoDto);
      });
    });

    describe('update', () => {
  //     it('should update the task of a mockTodo', async () => {
  //       const idToUpdate = randomUUID();
  //       const initialTodo: Todo = {
  //         id: idToUpdate,
  //         task: 'test task',
  //         completed: false,
  //       };
  //       const updateDto: UpdateTodoDto = { task: 'updated task' };
  //       const updatedTodo: Todo = {
  //         id: idToUpdate,
  //         task: updateDto.task,
  //         completed: false,
  //       };
  //       jest.spyOn(mockService, 'findOne').mockReturnValue(initialTodo);
  //       const paramsDto: TodoParamsDto = { id: idToUpdate };
  //       const foundTodo = await controller.findOne(paramsDto);

  //       expect(foundTodo).toEqual(initialTodo);

  //       jest.spyOn(mockService, 'update').mockReturnValue(updatedTodo);

  //       const result = await controller.update(paramsDto, updateDto);

  //       expect(mockService.update).toHaveBeenCalledWith(paramsDto.id, updateDto);
  //       expect(result).toEqual(updatedTodo);
  //       expect(result.id).toEqual(foundTodo.id);
  //     });

  //     it('should update the completion state of a mockTodo', async () => {
  //       const idToUpdate = randomUUID();
  //       const initialTodo: Todo = {
  //         id: idToUpdate,
  //         task: 'test task',
  //         completed: false,
  //       };
  //       const updateDto: UpdateTodoDto = { completed: true };
  //       const paramsDto: TodoParamsDto = { id: idToUpdate };
  //       const updatedTodo: Todo = {
  //         id: idToUpdate,
  //         task: 'test task',
  //         completed: updateDto.completed,
  //       };
  //       jest.spyOn(mockService, 'findOne').mockReturnValue(initialTodo);

  //       const foundTodo = await controller.findOne(paramsDto);

  //       expect(foundTodo).toEqual(initialTodo);

  //       jest.spyOn(mockService, 'update').mockReturnValue(updatedTodo);

  //       const result = await controller.update(paramsDto, updateDto);

  //       expect(mockService.update).toHaveBeenCalledWith(paramsDto.id, updateDto);
  //       expect(result).toEqual(updatedTodo);
  //       expect(result.id).toEqual(foundTodo.id);
  //     });
  //     it('should not update the mockTodo if no task and completion is passed', async () => {
  //       const idToUpdate = randomUUID();
  //       const initialTodo: Todo = {
  //         id: idToUpdate,
  //         task: 'test task',
  //         completed: false,
  //       };
  //       const updateDto: UpdateTodoDto = {};
  //       const updatedTodo: Todo = {
  //         id: idToUpdate,
  //         task: 'test task',
  //         completed: false,
  //       };
  //       const paramsDto: TodoParamsDto = { id: idToUpdate };
  //       jest.spyOn(mockService, 'findOne').mockReturnValue(initialTodo);

  //       const foundTodo = await controller.findOne(paramsDto);

  //       expect(foundTodo).toEqual(initialTodo);

  //       jest.spyOn(mockService, 'update').mockReturnValue(updatedTodo);

  //       const result = await controller.update(paramsDto, updateDto);

  //       expect(mockService.update).toHaveBeenCalledWith(paramsDto.id, updateDto);
  //       expect(result).toEqual(updatedTodo);
  //       expect(result.id).toEqual(foundTodo.id);
  //     });
    });

  //   describe('delete', () => {
  //     it('should delete the mockTodo by id', async () => {
  //       const idToRemove = randomUUID();
  //       const paramsDto: TodoParamsDto = { id: idToRemove };
  //       const mockTodo: Todo = {
  //         id: idToRemove,
  //         task: 'test task',
  //         completed: false,
  //       };

  //       jest.spyOn(mockService, 'findOne').mockReturnValueOnce(mockTodo);

  //       const foundTodo = await controller.findOne(paramsDto);
  //       expect(foundTodo).toEqual(mockTodo);

  //       await controller.remove(paramsDto);

  //       jest.spyOn(mockService, 'findOne').mockImplementation(() => {
  //         throw new TodoNotFoundException(idToRemove);
  //       });

  //       await expect(controller.findOne(paramsDto)).rejects.toThrow(
  //         new TodoNotFoundException(idToRemove),
  //       );
  //     });

  //     it('should foward the TodoNotFoundException if Todo was not found', async () => {
  //       const idToRemove = randomUUID();
  //       const expectedErrorMessage = `Todo with ID ${idToRemove} not found`;
  //       const paramsDto: TodoParamsDto = { id: idToRemove };

  //       jest.spyOn(mockService, 'remove').mockImplementation(() => {
  //         throw new TodoNotFoundException(idToRemove);
  //       });
  //       await expect(controller.remove(paramsDto)).rejects.toThrow(
  //         new TodoNotFoundException(idToRemove),
  //       );

  //       await expect(controller.remove(paramsDto)).rejects.toHaveProperty(
  //         'message',
  //         expectedErrorMessage,
  //       );
  //     });
  //   });
  // });
});
