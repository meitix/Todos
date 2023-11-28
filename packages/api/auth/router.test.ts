import express from "express";
import request from "supertest";
import { createAuthRouter } from "./router";
import * as cryptoModule from "./crypto";
import { User } from "../repo";
import { compare } from "./crypto";

jest.mock("../repo");
jest.mock("./crypto");

const mockCompare = cryptoModule.compare as jest.Mock;

const router = createAuthRouter("your-secret-key");
const app = express();
app.use(express.json());
app.use("/auth", router);

const originalEnv = process.env;

describe("Auth Router Tests", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });
  it("should register a new user", async () => {
    const mockUser = {
      id: "newUserId",
      name: "newuser@example.com",
      password: "hashedPassword",
    };
    (User.create as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/auth/register")
      .send({ username: "newuser@example.com", password: "newpassword" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  it("should return BAD_REQUEST for invalid registration credentials", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ username: "invalidemail", password: "short" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Email is not valid.");
  });

  it("should log in an existing user", async () => {
    // Mock the User.findOne method to return an existing user
    const mockUser = {
      id: "testUserId",
      name: "testuser@example.com",
      password: "hashedPassword",
    };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(true);

    const response = await request(app)
      .post("/auth/login")
      .send({ username: "testuser@example.com", password: "testpassword" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return BAD_REQUEST for invalid login credentials", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "invaliduser", password: "invalidpassword" });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Username or password is wrong.");
  });
});
