import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  task?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
