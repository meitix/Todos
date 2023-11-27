import { createContext, FC, useEffect, useState } from "react";

import { IAuthData } from "../models";

export const INITIAL_STATE: IAuthContext = {
  setAuthData: () => {},
  logOut: () => {},
  isAuthenticated: false,
  authData: {
    jwt: "",
    user: {
      id: "",
      username: "",
    },
  },
};

export interface IAuthContext {
  setAuthData: (auth: IAuthData) => void;
  logOut: () => void;
  isAuthenticated: boolean;
  authData: IAuthData;
}

export const AuthContext = createContext<IAuthContext>(INITIAL_STATE);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authData, setUserAuthData] = useState<IAuthData>(
    INITIAL_STATE.authData
  );

  useEffect(() => {
    const res = getStorage();
    setAuthData(res);
  }, []);

  const setAuthData = (data: IAuthData) => {
    const trimmedData = {
      jwt: data.jwt,
      user: {
        id: data.user.id,
        username: data.user.username,
      },
    };
    setUserAuthData(trimmedData);
    setStorage(trimmedData);
  };

  const logOut = () => {
    setUserAuthData(INITIAL_STATE.authData);
    setStorage(INITIAL_STATE.authData);
  };

  const isAuthenticated = authData.jwt ? true : false;

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

const setStorage = (data: IAuthData) => {
  localStorage.setItem(AUTH_RESULT_STORAGE_KEY, JSON.stringify(data));
};

export const getStorage = () => {
  let result: IAuthData;
  let storage = localStorage.getItem(AUTH_RESULT_STORAGE_KEY);
  if (storage) result = JSON.parse(storage);
  else result = INITIAL_STATE.authData;
  return result;
};
