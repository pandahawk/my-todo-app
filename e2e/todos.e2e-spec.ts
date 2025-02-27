import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

import * as request from 'supertest';
import { Todo } from '@entities/todo.entity';
import { setupE2E } from '../test/utils/setup-e2e';
import * as fs from 'fs';
import * as path from 'path';

describe('TodosController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const setup = await setupE2E();

    app = setup.app;
    dataSource = setup.dataSource;
  });

  beforeEach(async () => {

    if (!dataSource) {
      throw new Error(" DataSource is undefined in beforeEach!");
    }
     // Reset database manually instead of relying on synchronize(true)
     await dataSource.query(`DROP TABLE IF EXISTS "todo" CASCADE;`);
     await dataSource.query(`DROP SEQUENCE IF EXISTS todo_id_seq;`);

 
    // Recreate tables
    await dataSource.query(`
      CREATE SEQUENCE IF NOT EXISTS todo_id_seq;
      CREATE TABLE "todo" (
        "id" INTEGER PRIMARY KEY DEFAULT nextval('todo_id_seq'),
        "task" VARCHAR(255) NOT NULL,
        "completed" BOOLEAN NOT NULL DEFAULT false
      );
      ALTER SEQUENCE todo_id_seq RESTART WITH 101;
    `);

    const repository = dataSource.getRepository(Todo);
   
    const todosFilePath = path.join(__dirname, '../test/test-todos.json');
    const todosData = JSON.parse(fs.readFileSync(todosFilePath, 'utf-8'));


    await repository.save(todosData);
  });

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy(); // Close DB connection safely
    }
    
    if (app) {
      await app.close(); // Ensure the app closes properly
    }
  });

  it('/todos (GET)', () => {

    let expectedTodos: Todo[] = [
      {id: 101, "task": "Buy groceries", "completed": false },
      {id: 102, "task": "Finish writing blog post", "completed": true },
      {id: 103, "task": "Schedule dentist appointment", "completed": false },
      {id: 104, "task": "Read 20 pages of a book", "completed": true },
      {id: 105, "task": "Practice coding challenges", "completed": false },
      {id: 106, "task": "Water the plants", "completed": true },
      {id: 107, "task": "Plan weekend trip", "completed": false },
      {id: 108, "task": "Clean the workspace", "completed": false },
      {id: 109, "task": "Reply to pending emails", "completed": true },
      {id: 110, "task": "Go for a 30-minute run", "completed": false }
    ];

    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(10);
        expect(res.body).toStrictEqual(expectedTodos);
      });
  });

  // it('/todos/:id (GET) - should return a todo by ID', async () => {
  //   const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  //   return request(app.getHttpServer())
  //     .get(`/todos/${validId}`)
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.id).toBe(validId);
  //       expect(res.body.task).toBe('Buy groceries');
  //       expect(res.body.completed).toBe(false);
  //     });
  // });

  // it('/todos/:id (GET) - should return a 400 bad request for a non uuid', async () => {
  //   const notAnId = 'not-an-id';
  //   return request(app.getHttpServer())
  //     .get(`/todos/${notAnId}`)
  //     .expect(400)
  //     .expect((res) => {
  //       expect(res.body.error).toBe('Bad Request');
  //       expect(res.body.message).toStrictEqual(['id must be a UUID']);
  //     });
  // });

  // it('/todos/:id (GET) - should return a 404 not found for non existing todo id', async () => {
  //   const nonExistingId = 'f47ac10b-58cc-4372-a567-0e02b2c3d478';
  //   return request(app.getHttpServer())
  //     .get(`/todos/${nonExistingId}`)
  //     .expect(404)
  //     .expect((res) => {
  //       expect(res.body.error).toBe('Not Found');
  //       expect(res.body.message).toStrictEqual(
  //         `Todo with ID ${nonExistingId} not found`,
  //       );
  //     });
  // });

  // it('/todos (POST) - should return a 201 created and the new todo with random uuid, the given Task and completed = false', async () => {
  //   const createTodoDto: CreateTodoDto = {
  //     task: 'Grocery Shopping',
  //   };

  //   return request(app.getHttpServer())
  //     .post('/todos')
  //     .send(createTodoDto)
  //     .expect(201)
  //     .expect((res) => {
  //       expect(res.body.id).toBeDefined();
  //       expect(res.body.task).toBe(createTodoDto.task);
  //       expect(res.body.completed).toBeFalsy();
  //     });
  // });

  // it('/todos (POST) - should return 400 for invalid input', async () => {
  //   const invalidTodoDto = {
  //     // Missing required 'task' property
  //   };

  //   return request(app.getHttpServer())
  //     .post('/todos')
  //     .send(invalidTodoDto)
  //     .expect(400) // Expect Bad Request
  //     .expect((res) => {
  //       expect(res.body.error).toBe('Bad Request');
  //       expect(res.body.message).toBeDefined();
  //     });
  // });

  // it('/todos (PATCH) - should return 200 OK and the updated task of the todo', async () => {
  //   const idToUpdate = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  //   const updateDto: UpdateTodoDto = {
  //     task: 'Play with Caleb',
  //   };

  //   return request(app.getHttpServer())
  //     .patch(`/todos/${idToUpdate}`)
  //     .send(updateDto)
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.id).toBe(idToUpdate);
  //       expect(res.body.task).toBe(updateDto.task);
  //       expect(res.body.completed).toBe(false);
  //     });
  // });

  // it('/todos (PATCH) - should return 200 OK and the updated state of the todo', async () => {
  //   const idToUpdate = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  //   const updateDto: UpdateTodoDto = {
  //     completed: true,
  //   };

  //   return request(app.getHttpServer())
  //     .patch(`/todos/${idToUpdate}`)
  //     .send(updateDto)
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.id).toBe(idToUpdate);
  //       expect(res.body.completed).toBe(true);
  //     });
  // });

  // it('/todos (PATCH) - should return 200 OK and the updated state and task of the todo', async () => {
  //   const idToUpdate = '1aa8885b-6c71-4649-b541-017498c92a98';
  //   const updateDto: UpdateTodoDto = {
  //     completed: true,
  //     task: 'Dance with Ingrid',
  //   };

  //   return request(app.getHttpServer())
  //     .patch(`/todos/${idToUpdate}`)
  //     .send(updateDto)
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.id).toBe(idToUpdate);
  //       expect(res.body.completed).toBe(true);
  //       expect(res.body.task).toBe(updateDto.task);
  //     });
  // });

  // it('/todos (PATCH) - should return 400 Bad Request for a string as todo state', async () => {
  //   const idToUpdate = '1aa8885b-6c71-4649-b541-017498c92a98';
  //   const updateDto = {
  //     completed: 'true',
  //     task: 'Dance with Ingrid',
  //   };

  //   return request(app.getHttpServer())
  //     .patch(`/todos/${idToUpdate}`)
  //     .send(updateDto)
  //     .expect(400) // Expect Bad Request
  //     .expect((res) => {
  //       expect(res.body.error).toBe('Bad Request');
  //       expect(res.body.message).toStrictEqual([
  //         'completed must be a boolean value',
  //       ]);
  //     });
  // });

  // it('/todos (PATCH) - should return 400 Bad Request for an empty string as todo state', async () => {
  //   const idToUpdate = '1aa8885b-6c71-4649-b541-017498c92a98';
  //   const updateDto = {
  //     completed: true,
  //     task: '',
  //   };

  //   return request(app.getHttpServer())
  //     .patch(`/todos/${idToUpdate}`)
  //     .send(updateDto)
  //     .expect(400) // Expect Bad Request
  //     .expect((res) => {
  //       expect(res.body.error).toBe('Bad Request');
  //       expect(res.body.message).toStrictEqual(['task should not be empty']);
  //     });
  // });

  // it('/todos/:id (DELETE) - should retun 204 No Content and delete the todo by ID', async () => {
  //   const validId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  //   return request(app.getHttpServer()).delete(`/todos/${validId}`).expect(204);
  // });

  // it('/todos/:id (DELETE) - should delete the todo by ID', async () => {
  //   const nonExistingId = 'f47ac10b-58cc-4372-a567-0e02b2c3d478';
  //   return request(app.getHttpServer())
  //     .delete(`/todos/${nonExistingId}`)
  //     .expect(404)
  //     .expect((res) => {
  //       expect(res.body.error).toBe('Not Found');
  //       expect(res.body.message).toStrictEqual(
  //         `Todo with ID ${nonExistingId} not found`,
  //       );
  //     });
  // });
});
