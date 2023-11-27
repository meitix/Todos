import { createContext, FC, useContext } from "react";
import axios from "axios";
import { ICredentials, IAuthResult } from "models";

interface IAuthService {
  login(data: ICredentials): Promise<IAuthResult>;
  register(data: ICredentials): Promise<IAuthResult>;
}
interface IAuthURLs {
  host: string;
  login: string;
  register: string;
  loginWithGoogle: string;
  forgetPassword: string;
  resetPassword: string;
}

export class AuthService implements IAuthService {
  constructor(public urls: IAuthURLs) {
    this.urls = urls;
  }

  login(data: ICredentials): Promise<IAuthResult> {
    return axios
      .post<IAuthResult>(this.urls.login, data)
      .then((res) => res.data);
  }

  register(data: ICredentials): Promise<IAuthResult> {
    return axios
      .post<IAuthResult>(this.urls.register, data)
      .then((res) => res.data);
  }
}

export const AuthServiceContext = createContext<IAuthService | undefined>(
  undefined
);

export const useAuthService = () => {
  return useContext(AuthServiceContext)!;
};
