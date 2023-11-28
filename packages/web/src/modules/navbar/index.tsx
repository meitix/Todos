import { FC } from "react";
import { Container, Navbar } from "react-bootstrap";
import { useAuthentication } from "../auth";
import { Link } from "react-router-dom";

export const Nav: FC = () => {
  const { logOut } = useAuthentication();

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#">Bizcuid</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <Link
              style={{ cursor: "pointer" }}
              onClick={() => {
                logOut();
                window.location.href = "/";
              }}
              to={""}
            >
              Logout
            </Link>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
