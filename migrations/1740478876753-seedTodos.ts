import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedTodos1740478876753 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Example todos
        const todos = [
            { task: 'Grocery Shopping', completed: false },
            { task: 'Book Doctor Appointment', completed: true },
            { task: 'Pay Bills', completed: false },
            { task: 'Pick up Dry Cleaning', completed: true },
            { task: 'Call Mom', completed: false },
            { task: 'Schedule Team Meeting', completed: true },
            { task: 'Write Project Proposal', completed: false },
            { task: 'Buy Birthday Gift for Dad', completed: false },
            { task: 'Finish Reading Book', completed: true },
            { task: 'Water the Plants', completed: false },
        ];

        // Insert the todos into the database
        await queryRunner.manager.insert('todo', todos);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Delete all todos (optional)
         await queryRunner.query(`DELETE FROM "todo"`);
    }

}
