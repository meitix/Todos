export class InvalidTodoData extends Error {
  constructor() {
    super("Invalid todo properties.");
  }
}

export class TodoNotFoundError extends Error {
  constructor() {
    super("Todo not found.");
  }
}
