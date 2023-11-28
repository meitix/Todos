import { IGroup, ITodo } from "models/todos";
import { FC, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { logger } from "logger";

import { useTodoService } from "../service";

interface Props {
  group: IGroup;
  onCreate: (todo: ITodo) => any;
}

export const CreateTodo: FC<Props> = ({ onCreate, group }) => {
  const service = useTodoService();

  const [error, setError] = useState<string>();

  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [title, setTitle] = useState("");

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
    if (!dueDate) {
      setError("dueDate is required");
    }
    try {
      const todo = await service.createTodo({
        title,
        groupId: group.id,
        isDone: false,
        dueDate,
      });
      onCreate(todo);
    } catch (e: any) {
      logger.log(e);
      setError(e.response?.data.error);
    }
  };

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Add Todo..."
            onChange={(e) => setTitle(e.target.value)}
          />
          <Form.Control
            className="md-2"
            placeholder="Due Date"
            type="date"
            onChange={(e) => setDueDate(new Date(e.target.value))}
          />
          <Button variant="primary" type="submit">
            Add
          </Button>
        </InputGroup>
      </Form>
    </>
  );
};
