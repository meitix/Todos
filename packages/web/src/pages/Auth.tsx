import { FC, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { createAuthServiceProvider } from "../modules/auth/service";
import { authUrls } from "../config";
import { useAuthentication } from "../modules/auth/hooks/useAuthentication";

const AuthServiceProvider = createAuthServiceProvider(authUrls);

export const Auth: FC = () => {
  const { isAuthenticated } = useAuthentication();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated) {
      if (location.pathname === "/auth") navigate("login");
    } else {
      navigate("/");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <div>
      Auth
      <AuthServiceProvider>
        <Outlet />
      </AuthServiceProvider>
    </div>
  );
};
