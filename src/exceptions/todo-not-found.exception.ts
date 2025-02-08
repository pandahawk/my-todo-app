export class TodoNotFoundException extends Error {
  constructor(id: number) {
    super(`Todo with ID ${id} not found`);
    this.name = 'TodoNotFoundException';
  }
}
