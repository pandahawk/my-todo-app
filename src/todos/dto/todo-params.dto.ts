import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TodoParamsDto {
  @IsUUID('4') // Validate for UUID version 4
  @ApiProperty({ description: 'The UUID of the todo' })
  id: string;
}
