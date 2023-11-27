// yourHashModule.test.ts
import { hash, compare } from "./crypto";
import {
  genSalt,
  hash as bcryptHash,
  compare as bcryptCompare,
} from "bcryptjs";

jest.mock("bcryptjs");

describe("hash and compare Tests", () => {
  const mockGenSalt = genSalt as jest.Mock;
  const mockBcryptHash = bcryptHash as jest.Mock;
  const mockBcryptCompare = bcryptCompare as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should hash the plain text using bcrypt hash function", async () => {
    const plainText = "password123";
    const mockSalt = "mocked-salt";
    const mockHash = "mocked-hash";

    mockGenSalt.mockResolvedValue(mockSalt);
    mockBcryptHash.mockResolvedValue(mockHash);

    const hashedResult = await hash(plainText);

    expect(mockGenSalt).toHaveBeenCalledWith(7);
    expect(mockBcryptHash).toHaveBeenCalledWith(plainText, mockSalt);
    expect(hashedResult).toBe(mockHash);
  });

  it("should compare the plain text with the hashed value using bcrypt compare function", async () => {
    const plainText = "password123";
    const hashedValue = "mocked-hash";

    mockBcryptCompare.mockResolvedValue(true);

    const compareResult = await compare(plainText, hashedValue);

    expect(mockBcryptCompare).toHaveBeenCalledWith(plainText, hashedValue);
    expect(compareResult).toBe(true);
  });
});
