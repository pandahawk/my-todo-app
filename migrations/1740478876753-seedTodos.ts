import { randomUUID } from "crypto";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedTodos1740478876753 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Example todos
        const todos = [
            { id: randomUUID(), task: 'Grocery Shopping', completed: false },
            { id: randomUUID(), task: 'Book Doctor Appointment', completed: true },
            { id: randomUUID(), task: 'Pay Bills', completed: false },
            { id: randomUUID(), task: 'Pick up Dry Cleaning', completed: true },
            { id: randomUUID(), task: 'Call Mom', completed: false },
            { id: randomUUID(), task: 'Schedule Team Meeting', completed: true },
            { id: randomUUID(), task: 'Write Project Proposal', completed: false },
            { id: randomUUID(), task: 'Buy Birthday Gift for Dad', completed: false },
            { id: randomUUID(), task: 'Finish Reading Book', completed: true },
            { id: randomUUID(), task: 'Water the Plants', completed: false },
        ];

        // Insert the todos into the database
        await queryRunner.manager.insert('todo', todos);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Delete all todos (optional)
         await queryRunner.query(`DELETE FROM "todo"`);
    }

}
