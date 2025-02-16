import { NotFoundException } from '@nestjs/common';

export class TodoNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Todo with ID ${id} not found`);
    this.name = 'TodoNotFoundException';
  }
}
