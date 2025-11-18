import { Request, Response, NextFunction } from "express";
import { APIFenceAgent } from "./agent";

export function apifenceErrorHandler() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    APIFenceAgent.addEvent({
      type: "error",
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      statusCode: err.status || 500,
      message: err.message,
      stack: err.stack
    });

    next(err);
  };
}
