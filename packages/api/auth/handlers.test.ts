// yourRegisterModule.test.ts
import { createLoginHandler, createRegisterHandler } from "./handlers";
import { User } from "../repo";
import isEmail from "validator/lib/isEmail";
import { StatusCodes } from "http-status-codes";
import {
  InvalidEmailError,
  InvalidLoginCredentialsError,
  InvalidPasswordError,
  UserNotFoundError,
} from "./errors";
import * as cryptoModule from "./crypto";
import * as tokenManagerModule from "./token-manager";
import { AuthResult } from "models/auth";
import { logger } from "logger";

const login = createLoginHandler("secret-key");
const register = createRegisterHandler("secret-key");

jest.mock("validator/lib/isEmail");
jest.mock("../repo");
jest.mock("./crypto");
jest.mock("./token-manager");

jest.mock("logger", () => {
  const mockLogger = {
    log: jest.fn(),
  };

  return { logger: mockLogger };
});

const mockUserCreate = User.create as jest.Mock;
const mockHash = cryptoModule.hash as jest.Mock;
const mockCompare = cryptoModule.compare as jest.Mock;
const mockGenerate = tokenManagerModule.generate as jest.Mock;
const mockIsEmail = isEmail as jest.Mock;
const mockLogger = logger.log as jest.Mock;

describe("Auth Handlers", () => {
  describe("register Tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return BAD_REQUEST with InvalidEmailError if the provided email is not valid", async () => {
      mockIsEmail.mockReturnValue(false);

      const credentials = {
        username: "invalidEmail",
        password: "validPassword",
      };
      const result = await register(credentials);

      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
      expect(result.body).toBeInstanceOf(InvalidEmailError);
    });

    it("should return BAD_REQUEST with InvalidPasswordError if the provided password is too short", async () => {
      mockIsEmail.mockReturnValue(true);

      const credentials = {
        username: "validEmail@example.com",
        password: "short",
      };
      const result = await register(credentials);

      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
      expect(result.body).toBeInstanceOf(InvalidPasswordError);
    });

    it("should create a user, hash the password, generate a token, and return CREATED with AuthResult", async () => {
      mockIsEmail.mockReturnValue(true);
      mockHash.mockResolvedValue("hashedPassword");
      mockUserCreate.mockResolvedValue({ id: "userId", username: "username" });
      mockGenerate.mockResolvedValue("mockedToken");

      const credentials = {
        username: "validEmail@example.com",
        password: "validPassword",
      };
      const result = await register(credentials);

      expect(result.status).toBe(StatusCodes.CREATED);
      expect(result.body).toBeInstanceOf(AuthResult);
      expect(mockUserCreate).toHaveBeenCalledWith({
        username: credentials.username,
        password: "hashedPassword",
      });
      expect(mockHash).toHaveBeenCalledWith(credentials.password);
      expect(mockGenerate).toHaveBeenCalledWith(
        {
          username: "username",
          id: "userId",
        },
        "secret-key"
      );
    });

    it("should log an error and return INTERNAL_SERVER_ERROR if an error occurs during user creation", async () => {
      mockIsEmail.mockReturnValue(true);
      mockHash.mockResolvedValue("hashedPassword");
      mockUserCreate.mockRejectedValue(new Error("Some error"));

      const credentials = {
        username: "validEmail@example.com",
        password: "validPassword",
      };
      const result = await register(credentials);

      expect(result.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockLogger).toHaveBeenCalledWith(
        "error in creating user",
        expect.any(Error)
      );
    });
  });

  describe("login Tests", () => {
    const mockUserFindOne = User.findOne as jest.Mock;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return BAD_REQUEST with InvalidLoginCredentialsError if username or password is missing", async () => {
      const credentials = { username: "", password: "validPassword" };
      const result = await login(credentials);

      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
      expect(result.body).toBeInstanceOf(InvalidLoginCredentialsError);
      expect(result.body.message).toBe("Invalid login credentials");
    });

    it("should return NOT_FOUND with UserNotFoundError if no user is found", async () => {
      const credentials = {
        username: "nonexistentUser",
        password: "validPassword",
      };
      mockHash.mockResolvedValue("hashedPassword");
      mockUserFindOne.mockResolvedValue(null);

      const result = await login(credentials);

      expect(result.status).toBe(StatusCodes.NOT_FOUND);
      expect(result.body).toBeInstanceOf(UserNotFoundError);
      expect(result.body.message).toBe("Username or password is wrong.");
    });

    it("should create a token and return OK with AuthResult for valid credentials", async () => {
      const credentials = {
        username: "existingUser",
        password: "validPassword",
      };
      const user = {
        id: "userId",
        username: "existingUser",
        password: "hashedPassword",
      };

      mockHash.mockResolvedValue("hashedPassword");
      mockUserFindOne.mockResolvedValue(user);
      mockGenerate.mockResolvedValue("mockedToken");
      mockCompare.mockResolvedValue(true);

      const result = await login(credentials);

      expect(result.status).toBe(StatusCodes.OK);
      expect(result.body).toBeInstanceOf(AuthResult);
      expect(result.body.token).toBe("mockedToken");
    });

    it("should log an error and return INTERNAL_SERVER_ERROR if an error occurs during login", async () => {
      const credentials = {
        username: "existingUser",
        password: "validPassword",
      };
      mockHash.mockResolvedValue("hashedPassword");
      mockUserFindOne.mockRejectedValue(new Error("Some error"));

      const result = await login(credentials);

      expect(result.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.body).toBeUndefined();
      expect(mockLogger).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
