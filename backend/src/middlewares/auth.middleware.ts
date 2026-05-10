import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.accessToken;
  const refresh = req.cookies?.refreshToken;
  if (!token) {
    throw new AppError("Unauthorized", 401);
  }
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    throw new AppError("Invalid or expired Token", 401);
  }
}
