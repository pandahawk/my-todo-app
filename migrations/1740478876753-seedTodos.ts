import { Todo } from '@entities/todo.entity';

import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class SeedTodos1740478876753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Example todos
    const todosFilePath = path.join(__dirname, '../resources/todos.json');
    const todos: Todo[] = JSON.parse(fs.readFileSync(todosFilePath, 'utf-8'));

    // Insert the todos into the database
    await queryRunner.manager.insert('todo', todos);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete all todos (optional)
    await queryRunner.query(`DELETE FROM "todo"`);
  }
}
