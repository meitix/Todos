import { FC } from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { Nav } from "../navbar";

export const Layout: FC = () => {
  return (
    <Container fluid>
      <Nav />
      <Outlet />
    </Container>
  );
};
