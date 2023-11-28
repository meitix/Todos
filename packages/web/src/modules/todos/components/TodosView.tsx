import { FC, useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Tab, Tabs } from "react-bootstrap";
import { useTodoService } from "../service";
import { IGroup } from "models/todos";
import { CreateGroup } from "./CreateGroup";
import { logger } from "logger";
import { TodoList } from "./TodoList";
import { CreateTodo } from "./CreateTodo";

export const TodosView: FC = () => {
  const service = useTodoService();
  const [groups, setGroups] = useState<IGroup[]>();
  const [error, setError] = useState();

  const fetchGroups = useCallback(() => {
    service
      ?.getGroups()
      .then(setGroups)
      .catch((e) => setError(e.response?.error));
  }, [service]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const deleteGroup = async (id: number) => {
    try {
      await service?.deleteGroup(id);
      setGroups(groups?.filter((g) => id !== g.id));
    } catch (e: any) {
      logger.log(e);
      setError(e.response?.error);
    }
  };

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {!error && !groups && <p>Loading...</p>}
      {groups && (
        <Tabs className="mb-3" fill>
          {groups.map((group, i) => (
            <Tab eventKey={group.title} title={group.title}>
              <Row>
                <Col>
                  <Button
                    className="my-1"
                    size="sm"
                    variant="danger"
                    onClick={() => deleteGroup(group.id)}
                  >
                    Delete {group.title}
                  </Button>
                </Col>
              </Row>
              <br />
              <TodoList
                onUpdate={() => fetchGroups()}
                onDelete={() => fetchGroups()}
                todos={group.todos}
              />

              <br />
              <CreateTodo onCreate={() => fetchGroups()} group={group} />
            </Tab>
          ))}
          <Tab eventKey="add-group" title="+ Add Group">
            <CreateGroup onCreate={fetchGroups} />
          </Tab>
        </Tabs>
      )}
    </>
  );
};
