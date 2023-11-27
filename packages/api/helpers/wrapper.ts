import { Response } from "express";
import { RequestHandler } from "./handlers";
import { AuthorizedRequest } from "../auth";

export const handlerWrapper = (handler: RequestHandler) => {
  return async (req: AuthorizedRequest, res: Response) => {
    const data = [req.auth, req.params, req.body, req.query].filter(
      (d) => !!d && JSON.stringify(d) !== "{}"
    );
    const result = await handler(...data);
    let body = result.body;
    if (result.body instanceof Error) {
      body = { error: (body as Error).message };
    }
    res.status(result.status).header(result.headers).json(body);
  };
};
