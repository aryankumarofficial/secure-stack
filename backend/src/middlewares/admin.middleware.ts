import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/auth.js";
import { ROLE } from "../../.generated/prisma/index.js";
import AppError from "../utils/AppError.js";

export function adminMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  if (req.user.role !== ROLE.ADMIN) {
    return next(new AppError("Access denied", 403));
  }
  return next();
}
