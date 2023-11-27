export interface ICredentials {
  username: string;
  password: string;
}

export interface IUser {
  name: string;
  password: string;
}

export class AuthResult {
  constructor(
    public token: string,
    public refreshToken: string,
    public expiresIn: number
  ) {}
}
