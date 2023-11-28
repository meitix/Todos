import { createContext, FC, useEffect, useState } from "react";

import { AuthResult } from "models/auth";

export const INITIAL_STATE: IAuthContext = {
  setAuthData: () => {},
  logOut: () => {},
  isAuthenticated: false,
  authData: {
    token: "",
    refreshToken: "",
    expiresIn: 0,
  },
};

export interface IAuthContext {
  setAuthData: (auth: AuthResult) => void;
  logOut: () => void;
  isAuthenticated: boolean;
  authData: AuthResult;
}

export const AuthContext = createContext<IAuthContext>(INITIAL_STATE);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authData, setUserAuthData] = useState<AuthResult>(
    INITIAL_STATE.authData
  );

  useEffect(() => {
    const res = getStorage();
    setAuthData(res);
  }, []);

  const setAuthData = (data: AuthResult) => {
    setUserAuthData(data);
    setStorage(data);
  };

  const logOut = () => {
    setUserAuthData(INITIAL_STATE.authData);
    setStorage(INITIAL_STATE.authData);
  };

  const isAuthenticated = authData.token ? true : false;

  return (
    <AuthContext.Provider
      value={{
        authData,
        setAuthData,
        logOut,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AUTH_RESULT_STORAGE_KEY = "auth-result";

const setStorage = (data: AuthResult) => {
  localStorage.setItem(AUTH_RESULT_STORAGE_KEY, JSON.stringify(data));
};

export const getStorage = () => {
  let result: AuthResult;
  let storage = localStorage.getItem(AUTH_RESULT_STORAGE_KEY);
  if (storage) result = JSON.parse(storage);
  else result = INITIAL_STATE.authData;
  return result;
};
