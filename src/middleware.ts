import { Request, Response, NextFunction } from "express";
import { APIFenceAgent } from "./agent";

export function apifenceMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    let logged = false;

    const logRequest = () => {
      if (logged) return;
      logged = true;

      const duration = Date.now() - start;
      const statusCode = res.statusCode || 200;

      APIFenceAgent.addEvent({
        type: "request",
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        statusCode: statusCode,
        duration,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"]
      });
    };

    // Override multiple response methods to ensure we catch all responses
    const originalSend = res.send.bind(res);
    const originalJson = res.json.bind(res);
    const originalEnd = res.end.bind(res);

    res.send = function (body?: any) {
      logRequest();
      return originalSend(body);
    };

    res.json = function (body?: any) {
      logRequest();
      return originalJson(body);
    };

    res.end = function (chunk?: any, encoding?: any) {
      logRequest();
      return originalEnd(chunk, encoding);
    };

    // Also listen for the 'finish' event as a fallback
    res.once('finish', () => {
      logRequest();
    });

    next();
  };
}
