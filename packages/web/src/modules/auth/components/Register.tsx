import { FC, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export const Register: FC = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  return (
    <Row className="justify-content-md-center">
      <Col md={4}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="register.email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="name@example.com"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="register.password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              minLength={6}
              type="password"
              placeholder="Password"
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
      </Col>
    </Row>
  );
};
