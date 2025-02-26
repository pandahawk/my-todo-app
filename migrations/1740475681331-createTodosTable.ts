import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTodosTable1740475681331 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("Executing migration...");
        await queryRunner.query(`
            CREATE SEQUENCE IF NOT EXISTS todo_id_seq; -- Create sequence if it doesn't exist
            CREATE TABLE "todo" (
                "id" INTEGER PRIMARY KEY DEFAULT nextval('todo_id_seq'), 
                "task" VARCHAR(255) NOT NULL, 
                "completed" BOOLEAN NOT NULL DEFAULT false
            );

            ALTER SEQUENCE todo_id_seq RESTART WITH 101; -- Set starting ID to 101‚
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "todo";
        `);
    }

}
