import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";
import AppError from "../utils/AppError";

export function validate(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new AppError(result.error.issues[0]?.message || `Invalid Input`, 400),
      );
    }
    req.body = result.data;
    next();
  };
}
