import supertest from "supertest";
import { Group } from "../repo"; // Update the path to your repo
import express from "express";
import { groupRouter } from "./router";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  (req as any).auth = { id: 1, username: "testuser" };
  next();
});

app.use("/groups", groupRouter);
jest.mock("../repo", () => ({
  Group: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe("Group Router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new group", async () => {
    const createMock = Group.create as jest.Mock;
    createMock.mockResolvedValueOnce({ id: 1, title: "Test Group" });

    const response = await supertest(app)
      .post("/groups")
      .send({ title: "Test Group" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 1, title: "Test Group" });
    expect(createMock).toHaveBeenCalledWith({
      title: "Test Group",
      userId: 1,
    });
  });

  it("should get all groups", async () => {
    const findAllMock = Group.findAll as jest.Mock;
    findAllMock.mockResolvedValueOnce([{ id: 1, title: "Test Group" }]);

    const response = await supertest(app).get("/groups").send({ q: "Test" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, title: "Test Group" }]);
    expect(findAllMock).toHaveBeenCalledWith({
      where: {
        userId: 1,
        title: { [Symbol.for("like")]: "%Test%" },
      },
    });
  });

  it("should get a specific group", async () => {
    const findOneMock = Group.findOne as jest.Mock;
    findOneMock.mockResolvedValueOnce({ id: 1, title: "Test Group" });

    const response = await supertest(app).get("/groups/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, title: "Test Group" });
    expect(findOneMock).toHaveBeenCalledWith({
      where: {
        userId: 1,
        id: "1",
      },
    });
  });

  it("should update a group", async () => {
    const findOneMock = Group.findOne as jest.Mock;
    const mockGroupInstance = {
      id: 1,
      title: "Test Group",
      update: jest.fn(),
    };
    findOneMock.mockResolvedValueOnce(mockGroupInstance);
    mockGroupInstance.update.mockResolvedValue({
      id: 1,
      title: "Updated Group",
    });
    const response = await supertest(app)
      .put("/groups/1")
      .send({ title: "Updated Group" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, title: "Updated Group" });
    expect(findOneMock).toHaveBeenCalledWith({
      where: {
        userId: 1,
        id: "1",
      },
    });
    expect(mockGroupInstance.update).toHaveBeenCalledWith({
      title: "Updated Group",
    });
  });

  it("should delete a group", async () => {
    const findOneMock = Group.findOne as jest.Mock;
    const mockGroupInstance = {
      id: 1,
      title: "Test Group",
      destroy: jest.fn(),
    };
    findOneMock.mockResolvedValueOnce(mockGroupInstance);

    const response = await supertest(app).delete("/groups/1");

    expect(response.status).toBe(200);
    expect(findOneMock).toHaveBeenCalledWith({
      where: {
        userId: 1,
        id: "1",
      },
    });
    expect(mockGroupInstance.destroy).toHaveBeenCalled();
  });
});
