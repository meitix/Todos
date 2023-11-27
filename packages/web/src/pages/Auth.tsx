import { FC } from "react";
import { Outlet } from "react-router-dom";

export const Auth: FC = () => {
  return (
    <div>
      Auth
      <Outlet />
    </div>
  );
};
