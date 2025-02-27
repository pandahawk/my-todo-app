import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn() // No type specified, defaults to integer
  @ApiProperty({ description: 'The integer ID of the todo' })
  @IsNumber()
  @IsPositive()
  id?: number; // Type should be number

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'The task of the todo' })
  task: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Whether the todo is completed' })
  completed: boolean;
}
