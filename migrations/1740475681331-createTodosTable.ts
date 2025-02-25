import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTodosTable1740475681331 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("Executing migration...");
        await queryRunner.query(`
            CREATE TABLE "todo" (
                "id" UUID PRIMARY KEY, 
                "task" VARCHAR(255) NOT NULL, 
                "completed" BOOLEAN NOT NULL DEFAULT false
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "todo";
        `);
    }

}
