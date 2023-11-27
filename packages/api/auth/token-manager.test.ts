import { sign, verify } from "jsonwebtoken";

import { extract, generate } from "./token-manager";

jest.mock("jsonwebtoken");
const SECRET = "secret key";
describe("JWT Module Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("extract function", () => {
    it("should verify and return payload if secret key is present", () => {
      const token = "your-valid-token";
      (verify as jest.Mock).mockReturnValue({ some: "payload" });

      const result = extract(token, SECRET);

      expect(result).toMatchObject({ some: "payload" });

      expect(verify).toHaveBeenCalledWith(token, SECRET);
    });
  });

  describe("generate function", () => {
    it("should generate a token without expiration if expiresIn is not provided", () => {
      (sign as jest.Mock).mockReturnValue("mocked-token");

      const payload = { some: "payload" };
      const result = generate(payload, SECRET);

      expect(result).toBe("mocked-token");

      expect(sign).toHaveBeenCalledWith(payload, SECRET);
    });

    it("should generate a token with expiration if expiresIn is provided", () => {
      // Mock the sign function to always return a constant value
      (sign as jest.Mock).mockReturnValue("mocked-token");

      const payload = { some: "payload" };
      const expiresIn = 3600; // 1 hour
      const result = generate(payload, SECRET, expiresIn);

      expect(result).toBe("mocked-token");

      expect(sign).toHaveBeenCalledWith(payload, SECRET, {
        expiresIn,
      });
    });
  });
});
