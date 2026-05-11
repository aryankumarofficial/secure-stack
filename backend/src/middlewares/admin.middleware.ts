import type { NextFunction, Request, Response } from "express";

import AppError from "../utils/AppError.js";
import { ROLE } from "../../.generated/prisma/index.js";

export function adminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }

  if (req.user.role !== ROLE.ADMIN) {
    return next(new AppError("Access denied", 403));
  }

  return next();
}
