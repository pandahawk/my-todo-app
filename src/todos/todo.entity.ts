import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('todos') // Specify the table name (plural)
export class Todo {
  @PrimaryGeneratedColumn('uuid') // Use UUIDs for IDs
  id: string;

  @Column({ length: 255 }) // Task description, adjust length as needed
  task: string;

  @Column({ default: false }) // Completed status, default is false
  completed: boolean;
}