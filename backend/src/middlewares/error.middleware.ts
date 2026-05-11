import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";

export default function errorMiddleware(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (process.env.NODE_ENV === "development") console.error(err);

  return res.status(500).json({
    success: false,
    message: err.message,
  });
}
