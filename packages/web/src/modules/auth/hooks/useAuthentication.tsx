import { useContext } from "react";
import { AuthContext } from "../context/provider";

export const useAuthentication = () => {
  return useContext(AuthContext);
};
