import { FC, useEffect } from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import { useNavigate } from "react-router-dom";

export const Authenticated: FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthentication();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  return children;
};
