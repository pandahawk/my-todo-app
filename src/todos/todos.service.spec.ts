import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoNotFoundException } from '../exceptions/todo-not-found.exception';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService],
    }).compile();
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return the default todos', () => {
      const expected: Todo[] = [
        { id: 101, task: 'Buy groceries', completed: false },
        { id: 102, task: 'Walk the dog', completed: true },
        { id: 103, task: 'Pay bills', completed: false },
      ];

      const result = service.findAll();

      expect(result).toEqual(expected);
    });
  });

  describe('create', () => {
    it('should create a new todos with ids 104 and 105', () => {
      const firstTodoDto = new CreateTodoDto('Play with Caleb');
      const secondTodoDto = new CreateTodoDto('Dance with Ingrid');

      const firstNewTodo = service.create(firstTodoDto);
      const secondNewTodo = service.create(secondTodoDto);

      expect(firstNewTodo).toBeDefined();
      expect(firstNewTodo.id).toBe(104);
      expect(firstNewTodo.completed).toBeFalsy();
      expect(firstNewTodo.task).toBe('Play with Caleb');

      expect(secondNewTodo).toBeDefined();
      expect(secondNewTodo.id).toBe(105);
      expect(secondNewTodo.completed).toBeFalsy();
      expect(secondNewTodo.task).toBe('Dance with Ingrid');
    });
  });

  describe('find', () => {
    it('should find the todo with id 102', () => {
      const existingId = 102;

      const result = service.find(existingId);

      expect(result).toStrictEqual({
        id: 102,
        task: 'Walk the dog',
        completed: true,
      });
    });

    it('should throw an NotFoundException because id 110 does not exist', () => {
      const id = 110;
      expect(() => service.find(id)).toThrow(TodoNotFoundException);
    });
  });
});
