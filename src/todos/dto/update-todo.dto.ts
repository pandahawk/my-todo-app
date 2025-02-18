import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({ description: 'The task of the todo', required: false })
  task?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether the todo is completed',
    required: false,
  })
  completed?: boolean;
}
