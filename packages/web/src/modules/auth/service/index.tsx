import { createContext, FC, useContext } from "react";
import axios from "axios";
import { ICredentials, AuthResult } from "models/auth";

interface IAuthService {
  login(data: ICredentials): Promise<AuthResult>;
  register(data: ICredentials): Promise<AuthResult>;
}
interface IAuthURLs {
  login: string;
  register: string;
}

export class AuthService implements IAuthService {
  constructor(public urls: IAuthURLs) {
    this.urls = urls;
  }

  login(data: ICredentials): Promise<AuthResult> {
    return axios
      .post<AuthResult>(this.urls.login, data)
      .then((res) => res.data);
  }

  register(data: ICredentials): Promise<AuthResult> {
    return axios
      .post<AuthResult>(this.urls.register, data)
      .then((res) => res.data);
  }
}

export const AuthServiceContext = createContext<IAuthService | undefined>(
  undefined
);

export const useAuthService = () => {
  return useContext(AuthServiceContext)!;
};

export const createAuthServiceProvider = (
  urls: IAuthURLs
): FC<{ children: React.ReactNode }> => {
  return ({ children }) => (
    <AuthServiceContext.Provider value={new AuthService(urls)}>
      {children}
    </AuthServiceContext.Provider>
  );
};
