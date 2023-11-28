import { FC, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useAuthService } from "../service";
import { ICredentials } from "models/auth";
import { Link, useNavigate } from "react-router-dom";
import { logger } from "logger";
import { useAuthentication } from "../hooks/useAuthentication";

export const Login: FC = () => {
  const service = useAuthService();
  const { setAuthData } = useAuthentication();
  const navigate = useNavigate();

  const [error, setError] = useState<string>();

  const [validated, setValidated] = useState(false);
  const [values, setValues] = useState<ICredentials>({
    username: "",
    password: "",
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
    }

    setValidated(true);
    try {
      const authResult = await service.login(values);
      setAuthData(authResult);
      navigate("/");
    } catch (e: any) {
      logger.log(e);
      setError(e.response?.data.error);
    }
  };
  return (
    <Row className="justify-content-md-center">
      <Col md={4}>
        {error && <p className="text-danger text-lg">{error}</p>}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="Login.email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="name@example.com"
              name="username"
              onChange={handleChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="Login.password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              required
              minLength={6}
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Password must be at least 6 characters
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

        <p>
          Don't have an account yet?{" "}
          <Link to="../register"> Register here</Link>
        </p>
      </Col>
    </Row>
  );
};
