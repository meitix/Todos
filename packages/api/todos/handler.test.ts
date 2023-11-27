import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from "./handlers"; // Replace with the actual path to your module
import { Todo } from "../repo";
import { StatusCodes } from "http-status-codes";
import { InvalidTodoData, TodoNotFoundError } from "./errors";

jest.mock("../repo"); // Mock the entire repo module

describe("Todo Functions Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createTodo should create a new todo", async () => {
    // Mock the save method of the Todo prototype
    (Todo.create as jest.Mock).mockImplementation(function (this: Todo) {
      return {
        id: 1,
        groupId: 1,
        title: "Test Todo",
        userId: 1,
        dueDate: "2023-12-01",
      };
    });

    const mockUser = { id: 1, username: "testuser" };
    const mockTodoCreateModel = {
      title: "Test Todo",
      dueDate: "2023-12-01",
      groupId: 1,
    };

    const result = await createTodo(mockUser, mockTodoCreateModel);
    expect(result.status).toBe(StatusCodes.CREATED);
    expect(result.body).toHaveProperty("id", 1);
  });

  it("createTodo should return BAD_REQUEST for invalid todo data", async () => {
    const mockUser = { id: 1, username: "testuser" };
    const mockInvalidTodoCreateModel = {
      title: "",
      dueDate: "2023-12-01",
      groupId: 1,
    };

    const result = await createTodo(mockUser, mockInvalidTodoCreateModel);

    expect(result.status).toBe(StatusCodes.BAD_REQUEST);
    expect(result.body).toBeInstanceOf(InvalidTodoData);
  });

  it("getTodos should get user todos with optional search query", async () => {
    (Todo.findAll as jest.Mock).mockResolvedValue([
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
    ]);

    const mockUser = { id: 1, username: "testuser" };
    const mockQuery = "Test Todo";

    const result = await getTodos(mockUser, { q: mockQuery });

    expect(result.status).toBe(StatusCodes.OK);
    expect(result.body).toHaveLength(2);
  });

  it("getTodo should get a specific user todo by ID", async () => {
    (Todo.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      groupId: 1,
      title: "Test Todo 1",
      userId: 1,
      dueDate: "2023-12-01",
    });

    const mockUser = { id: 1, username: "testuser" };
    const mockTodoId = 1;

    const result = await getTodo(mockUser, mockTodoId);

    expect(result.status).toBe(StatusCodes.OK);
    expect(result.body).toHaveProperty("id", 1);
  });

  it("getTodo should return NOT_FOUND for a non-existing user todo by ID", async () => {
    (Todo.findOne as jest.Mock).mockResolvedValue(null);

    const mockUser = { id: 1, username: "testuser" };
    const mockNonExistingTodoId = 999;

    const result = await getTodo(mockUser, mockNonExistingTodoId);

    expect(result.status).toBe(StatusCodes.NOT_FOUND);
    expect(result.body).toBeInstanceOf(TodoNotFoundError);
  });

  it("updateTodo should update an existing user todo by ID", async () => {
    const mockTodoInstance = {
      id: 1,
      groupId: 1,
      title: "Test Todo 1",
      userId: 1,
      dueDate: "2023-12-01",
      update: jest.fn(),
      save: jest.fn(),
    };

    (Todo.findOne as jest.Mock).mockResolvedValue(mockTodoInstance);

    const mockUser = { id: 1, username: "testuser" };
    const mockTodoId = 1;
    const mockUpdatedFields = { title: "Updated Todo", dueDate: "2023-12-02" };

    const result = await updateTodo(mockUser, mockTodoId, mockUpdatedFields);

    expect(result.status).toBe(StatusCodes.OK);
    expect(mockTodoInstance.update).toHaveBeenCalledWith(mockUpdatedFields);
    expect(mockTodoInstance.update).toHaveBeenCalled();
  });

  it("updateTodo should return NOT_FOUND for updating a non-existing user todo by ID", async () => {
    (Todo.findOne as jest.Mock).mockResolvedValue(null);

    const mockUser = { id: 1, username: "testuser" };
    const mockNonExistingTodoId = 999;
    const mockUpdatedFields = { title: "Updated Todo", dueDate: "2023-12-02" };

    const result = await updateTodo(
      mockUser,
      mockUpdatedFields,
      mockNonExistingTodoId
    );

    expect(result.status).toBe(StatusCodes.NOT_FOUND);
    expect(result.body).toBeInstanceOf(TodoNotFoundError);
  });

  it("deleteTodo should delete an existing user todo by ID", async () => {
    const mockTodoInstance = {
      id: 1,
      groupId: 1,
      title: "Test Todo 1",
      userId: 1,
      destroy: jest.fn(),
    };

    (Todo.findOne as jest.Mock).mockResolvedValue(mockTodoInstance);

    const mockUser = { id: 1, username: "testuser" };
    const mockTodoId = 1;

    const result = await deleteTodo(mockUser, mockTodoId);

    expect(result.status).toBe(StatusCodes.OK);
    expect(mockTodoInstance.destroy).toHaveBeenCalled();
  });

  it("deleteTodo should return NOT_FOUND for deleting a non-existing user todo by ID", async () => {
    (Todo.findOne as jest.Mock).mockResolvedValue(null);

    const mockUser = { id: 1, username: "testuser" };
    const mockNonExistingTodoId = 999;

    const result = await deleteTodo(mockUser, mockNonExistingTodoId);

    expect(result.status).toBe(StatusCodes.NOT_FOUND);
    expect(result.body).toBeInstanceOf(TodoNotFoundError);
  });
});
