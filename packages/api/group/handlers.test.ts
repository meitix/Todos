import { Group } from "../repo";
import {
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  updateGroup,
} from "./handlers";

jest.mock("../repo", () => {
  const originalModule = jest.requireActual("../repo");
  return {
    ...originalModule,
    Group: {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
  };
});

describe("Group Handlers", () => {
  it("should create a new group", async () => {
    const createMock = Group.create as jest.Mock;
    createMock.mockResolvedValueOnce({ id: 1, title: "Test Group" });

    const result = await createGroup({ id: "userId" }, { title: "Test Group" });

    expect(result.status).toBe(201);
    expect(result.body).toEqual({ id: 1, title: "Test Group" });
    expect(createMock).toHaveBeenCalledWith({
      title: "Test Group",
      userId: "userId",
    });
  });

  it("should get all groups", async () => {
    const findAllMock = Group.findAll as jest.Mock;
    findAllMock.mockResolvedValueOnce([{ id: 1, title: "Test Group" }]);

    const result = await getGroups({ id: "userId" }, { q: "Test" });

    expect(result.status).toBe(200);
    expect(result.body).toEqual([{ id: 1, title: "Test Group" }]);
    expect(findAllMock).toHaveBeenCalled();
  });

  it("should get a specific group", async () => {
    const findOneMock = Group.findOne as jest.Mock;
    findOneMock.mockResolvedValueOnce({ id: 1, title: "Test Group" });

    const result = await getGroup({ id: "userId" }, { id: 1 });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ id: 1, title: "Test Group" });
    expect(findOneMock).toHaveBeenCalledWith({
      where: {
        userId: "userId",
        id: 1,
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

    const result = await updateGroup({ id: "userId" }, 1, {
      title: "Updated Group",
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ id: 1, title: "Updated Group" });
    expect(findOneMock).toHaveBeenCalledWith({
      where: {
        userId: "userId",
        id: 1,
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

    const result = await deleteGroup({ id: "userId" }, 1);

    expect(result.status).toBe(200);
    expect(findOneMock).toHaveBeenCalledWith({
      where: {
        userId: "userId",
        id: 1,
      },
    });
    expect(mockGroupInstance.destroy).toHaveBeenCalled();
  });
});
