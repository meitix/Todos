import { ITodo } from "models/todos";
import { FC, useState } from "react";
import { Button, Col, FormCheck, ListGroup, Row } from "react-bootstrap";
import { useTodoService } from "../service";
import { logger } from "logger";

interface Props {
  todos: ITodo[];
  onDelete: (todo: ITodo) => any;
  onUpdate: (todo: ITodo) => any;
}

export const TodoList: FC<Props> = ({ todos, onDelete, onUpdate }) => {
  const service = useTodoService();
  const [error, setError] = useState();

  const handleDelete = async (todo: ITodo) => {
    try {
      await service?.deleteTodo(todo.id);
      onDelete(todo);
    } catch (e: any) {
      logger.log(e);
      setError(e.response?.error);
    }
  };

  const toggleIsDone = async (todo: ITodo) => {
    if (!service) throw new Error("Todo service is not initialized");
    try {
      const t = await service.updateTodo(todo.id, { isDone: !todo.isDone });
      onUpdate(t);
    } catch (e: any) {
      logger.log(e);
      setError(e.response.error);
    }
  };
  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item>
            <Row>
              <Col md="auto">
                <FormCheck
                  checked={todo.isDone}
                  onChange={() => toggleIsDone(todo)}
                />
              </Col>
              <Col
                className={
                  todo.isDone ? "text-decoration-line-through text-muted" : ""
                }
              >
                {todo.title} --{" "}
                <span className="text-sm">
                  {" "}
                  {new Date(todo.dueDate).toDateString()}
                </span>
              </Col>
              <Col md="auto">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(todo)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};
