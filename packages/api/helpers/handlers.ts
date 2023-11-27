import { StatusCodes } from "http-status-codes";

export type RequestHandler = (...args: any) => Promise<HandlerResult>;

export class HandlerResult {
  headers?: { [key: string]: string };

  constructor(public status: StatusCodes, public body?: any) {}
}
