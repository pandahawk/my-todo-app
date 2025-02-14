export class TodoNotFoundException extends Error {
  constructor(id: string) {
    super(`Todo with ID ${id} not found`);
    this.name = 'TodoNotFoundException';
  }
}
