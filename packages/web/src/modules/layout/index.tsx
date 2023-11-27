import { FC } from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

export const Layout: FC = () => {
  return (
    <Container fluid>
      <Outlet />
    </Container>
  );
};
