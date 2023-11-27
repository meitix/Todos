export interface IAuthData {
  jwt: string;
  user: {
    id: string;
    username: string;
  };
}
