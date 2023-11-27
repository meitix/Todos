export class InvalidGroupData extends Error {
  constructor() {
    super("Invalid group properties.");
  }
}

export class GroupNotFoundError extends Error {
  constructor() {
    super("Group not found.");
  }
}
