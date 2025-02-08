import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class FindTodoParamsDto {
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;
}
