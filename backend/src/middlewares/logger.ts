import type { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const time = new Date().toISOString();
  const origin = (req.headers.origin as string) || `Same-Origin/No Origin`;
  console.log(`[${time}] ${req.method} ${req.url} | Origin: ${origin}`);
  next();
};

export default logger;
