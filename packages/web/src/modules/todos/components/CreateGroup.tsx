import { IGroup } from "models/todos";
import { FC, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useTodoService } from "../service";
import { logger } from "logger";

interface Props {
  onCreate: (group: IGroup) => any;
}

export const CreateGroup: FC<Props> = ({ onCreate }) => {
  const service = useTodoService();

  const [error, setError] = useState<string>();

  const [validated, setValidated] = useState(false);
  const [title, setTitle] = useState("");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setTitle(e.target.value);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    const form = event.currentTarget;
    event.preventDefault();
    form.checkValidity();

    if (!service) {
      throw new Error("Todo service is not initialized.");
    }
    if (!title) {
      setError("title is required");
    }

    setValidated(true);
    try {
      const group = await service.createGroup({ title });
      onCreate(group);
    } catch (e: any) {
      logger.log(e);
      setError(e.response?.data.error);
    }
  };
  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="Login.email">
          <Form.Label>Group</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Group Title"
            name="title"
            onChange={handleChange}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Title shouldn't be empty
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          Add
        </Button>
      </Form>
    </>
  );
};
