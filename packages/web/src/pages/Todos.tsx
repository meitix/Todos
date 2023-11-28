import { FC } from "react";
import { createTodoServiceProvider } from "../modules/todos";
import { useAuthentication } from "../modules/auth";
import { todoUrls } from "../config";
import { Container } from "react-bootstrap";
import { TodosView } from "../modules/todos/components";

export const Todos: FC = () => {
  const { authData } = useAuthentication();
  const TodoServiceProvider = createTodoServiceProvider(authData, todoUrls);

  return (
    <TodoServiceProvider>
      <Container>
        <h1>Todos</h1>
        <TodosView />
      </Container>
    </TodoServiceProvider>
  );
};
