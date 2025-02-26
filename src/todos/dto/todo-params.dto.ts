import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class TodoParamsDto {
  @ApiProperty({ description: 'The int ID of the todo' })
  @IsNumber()
  @Transform(({ value }) => +value) 
  @Min(1)
  id: number;
}
