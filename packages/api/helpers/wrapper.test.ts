import { handlerWrapper } from "./wrapper";
import { Request, Response } from "express";

const mockHandler: jest.Mock = jest.fn();
const mockResult = {
  status: 200,
  headers: { "Content-Type": "application/json" },
  body: { message: "Success" },
};

jest.mock("./handlers", () => ({
  RequestHandler: jest.fn(() => mockHandler),
}));

describe("handlerWrapper Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: { test: "this is a test payload" },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      header: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call the handler with the request body and set response status, headers, and body", async () => {
    mockHandler.mockResolvedValue(mockResult);

    const wrappedHandler = handlerWrapper(mockHandler);
    await wrappedHandler(mockRequest as Request, mockResponse as Response);

    expect(mockHandler).toHaveBeenCalledWith(mockRequest.body);

    expect(mockResponse.status).toHaveBeenCalledWith(mockResult.status);
    expect(mockResponse.header).toHaveBeenCalledWith(mockResult.headers);
    expect(mockResponse.json).toHaveBeenCalledWith(mockResult.body);
  });
});
