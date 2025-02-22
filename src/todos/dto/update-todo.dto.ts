import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The task description',
    example: 'Walk the dog',
    maxLength: 255,
    required: false,
  })
  task?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether the todo is completed',
    required: false,
  })
  completed?: boolean;
}
