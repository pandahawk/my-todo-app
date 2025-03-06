import { INestApplication, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import * as request from 'supertest';
import { Todo } from '@entities/todo.entity';
import * as fs from 'fs';
import * as path from 'path';
import { setupE2E } from './setup-e2e';
import { CreateTodoDto } from '@todos/dto/create-todo.dto';
import { UpdateTodoDto } from '@todos/dto/update-todo.dto';
const logger = new Logger('Todo e2e');

describe('TodosController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    logger.log('setting up e2e...');
    const setup = await setupE2E();

    app = setup.app;
    dataSource = setup.dataSource;
    logger.log('e2e setup done.');
  });

  beforeEach(async () => {
    const repository = dataSource.getRepository(Todo);

    // Clear existing data
    await repository.clear();

    // Reset auto-increment value
    await dataSource.query(`DELETE FROM sqlite_sequence WHERE name = 'todo'`);
    await dataSource.query(`INSERT INTO sqlite_sequence (name, seq) VALUES ('todo', 100)`);

    const todosFilePath = path.join(__dirname, '../resources/test-todos.json');
    const todosData: Todo[] = JSON.parse(
      fs.readFileSync(todosFilePath, 'utf-8'),
    );
    await repository.save(todosData);
  });

  afterAll(async () => {
    logger.log('tearing down e2e...');
    if (dataSource) {
      logger.log('Closing database connection...');
      await dataSource.destroy(); // Close DB connection safely
    }

    if (app) {
      logger.log('Closing NestJS app...');
      await app.close(); // Ensure the app closes properly
    }

    logger.log('tear down complete.');
  });

  it('/todos (GET)', async () => {
    let expectedTodos: Todo[] = [
      { id: 101, task: 'Test Todo 1', completed: false },
      { id: 102, task: 'Test Todo 2', completed: true },
      { id: 103, task: 'Test Todo 3', completed: false },
      { id: 104, task: 'Test Todo 4', completed: true },
      { id: 105, task: 'Test Todo 5', completed: false },
    ];

    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect((res) => {
        // logger.debug({body: res.body, expected: expectedTodos})
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(5);
        expect(res.body).toStrictEqual(expectedTodos);
      });
  });

  it('/todos/:id (GET) - should return a todo by ID', async () => {
    const validId = 104;
    return request(app.getHttpServer())
      .get(`/todos/${validId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(validId);
        expect(res.body.task).toBe('Test Todo 4');
        expect(res.body.completed).toBe(true);
      });
  });

  it('/todos/:id (GET) - should return a 400 bad request for a non uuid', async () => {
    const notAnId = 'notanid';
    return request(app.getHttpServer())
      .get(`/todos/${notAnId}`)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBe('Bad Request');
        expect(res.body.message).toEqual([
          'id must not be less than 1',
           'id must be a number conforming to the specified constraints'
        ]);
      });
  });

  it('/todos/:id (GET) - should return a 404 not found for non existing todo id', async () => {
    const nonExistingId = 1000;
    return request(app.getHttpServer())
      .get(`/todos/${nonExistingId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Not Found');
        expect(res.body.message).toStrictEqual(
          `Todo with ID ${nonExistingId} not found`,
        );
      });
  });

  it('/todos (POST) - should return a 201 created and the new todo with random uuid, the given Task and completed = false', async () => {
    const createTodoDto: CreateTodoDto = {
      task: 'New Test Todo',
    };

    return request(app.getHttpServer())
      .post('/todos')
      .send(createTodoDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.task).toBe(createTodoDto.task);
        expect(res.body.completed).toBeFalsy();
      });
  });

  it('/todos (POST) - should return 400 for invalid input', async () => {
    const invalidTodoDto = {
      // Missing required 'task' property
    };

    return request(app.getHttpServer())
      .post('/todos')
      .send(invalidTodoDto)
      .expect(400) // Expect Bad Request
      .expect((res) => {
        expect(res.body.error).toBe('Bad Request');
        expect(res.body.message).toBeDefined();
      });
  });

  it('/todos (PATCH) - should return 200 OK and the updated task of the todo', async () => {
    const idToUpdate = 101;
    const updateDto: UpdateTodoDto = {
      task: 'Play with Caleb',
    };

    return request(app.getHttpServer())
      .patch(`/todos/${idToUpdate}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(idToUpdate);
        expect(res.body.task).toBe(updateDto.task);
        expect(res.body.completed).toBe(false);
      });
  });

  it('/todos (PATCH) - should return 200 OK and the updated state of the todo', async () => {
    const idToUpdate = 101;
    const updateDto: UpdateTodoDto = {
      completed: true,
    };

    return request(app.getHttpServer())
      .patch(`/todos/${idToUpdate}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(idToUpdate);
        expect(res.body.completed).toBe(true);
      });
  });

  it('/todos (PATCH) - should return 200 OK and the updated state and task of the todo', async () => {
    const idToUpdate = 102;
    const updateDto: UpdateTodoDto = {
      completed: true,
      task: 'Dance with Ingrid',
    };

    return request(app.getHttpServer())
      .patch(`/todos/${idToUpdate}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(idToUpdate);
        expect(res.body.completed).toBe(true);
        expect(res.body.task).toBe(updateDto.task);
      });
  });

  it('/todos (PATCH) - should return 400 Bad Request for a string as todo state', async () => {
    const idToUpdate = 101;
    const updateDto = {
      completed: 'true',
      task: 'Dance with Ingrid',
    };

    return request(app.getHttpServer())
      .patch(`/todos/${idToUpdate}`)
      .send(updateDto)
      .expect(400) // Expect Bad Request
      .expect((res) => {
        expect(res.body.error).toBe('Bad Request');
        expect(res.body.message).toStrictEqual([
          'completed must be a boolean value',
        ]);
      });
  });

  it('/todos (PATCH) - should return 400 Bad Request for an empty string as todo state', async () => {
    const idToUpdate = 105;
    const updateDto = {
      completed: true,
      task: '',
    };

    return request(app.getHttpServer())
      .patch(`/todos/${idToUpdate}`)
      .send(updateDto)
      .expect(400) // Expect Bad Request
      .expect((res) => {
        expect(res.body.error).toBe('Bad Request');
        expect(res.body.message).toStrictEqual(['task should not be empty']);
      });
  });

  it('/todos/:id (DELETE) - should retun 204 No Content and delete the todo by ID', async () => {
    const validId = 105;
    return request(app.getHttpServer()).delete(`/todos/${validId}`).expect(204);
  });

  it('/todos/:id (DELETE) - should delete the todo by ID', async () => {
    const nonExistingId = 106;
    const todos = await dataSource.getRepository(Todo).find(); // Await the find method
    logger.log(todos); // Log the resolved value
    return request(app.getHttpServer())
      .delete(`/todos/${nonExistingId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Not Found');
        expect(res.body.message).toStrictEqual(
          `Todo with ID ${nonExistingId} not found`,
        );
      });
  });
});
