export class InvalidEmailError extends Error {
  constructor() {
    super("Email is not valid.");
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super("Password must be at least 6 characters");
  }
}

export class InvalidLoginCredentialsError extends Error {
  constructor() {
    super("Invalid login credentials");
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("Username or password is wrong.");
  }
}

export class MissingJWTSecretKey extends Error {
  constructor() {
    super(`JWT secret key is missing in the environment variables.`);
  }
}
