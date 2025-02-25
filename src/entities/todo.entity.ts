import { ApiProperty } from "@nestjs/swagger";
import { randomUUID } from "crypto";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Todo{
    @PrimaryColumn('uuid')
    @ApiProperty({ description: 'The uuid of the todo' })
    id: string;

    @Column()
    @ApiProperty({ description: 'The task of the todo' })
    task: string;

    @Column({ default: false }) 
    @ApiProperty({ description: 'Whether the todo is completed' })
    completed: boolean;

    constructor() {
        this.id = randomUUID(); // Generate UUID using crypto
      }
}