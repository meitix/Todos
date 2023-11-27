import request from "supertest";
import { todoRouter } from "./router";
import { Todo } from "../repo";
import express from "express";
import { Op } from "sequelize";

jest.mock("../repo");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  (req as any).auth = { id: 1, username: "testuser" };
  next();
});
app.use("/", todoRouter);

describe("Todo Router Integration Tests", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("POST / should create a new todo", async () => {
    (Todo.create as jest.Mock).mockResolvedValue({
      id: 1,
      groupId: 1,
      title: "Test Todo",
      userId: 1,
      dueDate: "2023-12-01",
    });

    const response = await request(app)
      .post("/")
      .send({ title: "Test Todo", dueDate: "2023-12-01", groupId: 1 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", 1);
  });

  it("GET / should get user todos", async () => {
    const mockTodos = [
      {
        id: 1,
        groupId: 1,
        title: "Test Todo 1",
        userId: 1,
        dueDate: "2023-12-01",
      },
      {
        id: 2,
        groupId: 1,
        title: "Test Todo 2",
        userId: 1,
        dueDate: "2023-12-02",
      },
    ];

    const findAllMock = Todo.findAll as jest.Mock;

    findAllMock.mockResolvedValue(mockTodos);

    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTodos);
    expect(findAllMock).toBeCalledWith({
      where: { userId: 1 },
    });
  });

  it("GET / should get user searched", async () => {
    const mockTodos = [
      {
        id: 2,
        groupId: 1,
        title: "Test Todo 2",
        userId: 1,
        dueDate: "2023-12-02",
      },
    ];

    const findAllMock = Todo.findAll as jest.Mock;

    findAllMock.mockResolvedValue(mockTodos);

    const response = await request(app).get("/?q=Test Todo 2");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Test Todo 2");
    expect(findAllMock).toBeCalledWith({
      where: { userId: 1, title: { [Op.like]: `%Test Todo 2%` } },
    });
  });
  it("GET /:id should get a specific user todo by ID", async () => {
    const mockTodo = {
      id: 1,
      groupId: 1,
      title: "Test Todo",
      userId: 1,
      dueDate: "2023-12-01",
    };
    const findMock = Todo.findOne as jest.Mock;
    findMock.mockResolvedValue(mockTodo);

    const response = await request(app).get("/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTodo);
    expect(findMock).toBeCalledWith({ where: { id: "1", userId: 1 } });
  });

  it("PUT /:id should update an existing user todo by ID", async () => {
    const mockTodo = {
      id: 1,
      groupId: 1,
      title: "Test Todo",
      userId: 1,
      dueDate: "2023-12-01",
    };

    (Todo.findOne as jest.Mock).mockResolvedValue(new Todo(mockTodo));
    (Todo.prototype.update as jest.Mock).mockResolvedValue(mockTodo);

    const response = await request(app)
      .put("/1")
      .send({ title: "Updated Todo", dueDate: "2023-12-02" });
    expect(Todo.prototype.update).toBeCalledWith({
      title: "Updated Todo",
      dueDate: "2023-12-02",
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTodo);
  });

  it("DELETE /:id should delete an existing user todo by ID", async () => {
    const mockTodo = {
      id: 1,
      groupId: 1,
      title: "Test Todo",
      userId: 1,
      dueDate: "2023-12-01",
    };

    const deleteMock = Todo.prototype.destroy as jest.Mock;
    (Todo.findOne as jest.Mock).mockResolvedValue(new Todo(mockTodo));
    deleteMock.mockResolvedValue(null);

    const response = await request(app).delete("/1");

    expect(response.status).toBe(200);
    expect(deleteMock).toBeCalled();
  });
});
