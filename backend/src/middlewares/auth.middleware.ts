import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { findSessionById } from "../db/repository/session.repo.js";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    throw new AppError("Unauthorized", 401);
  }
  try {
    const payload = verifyAccessToken(accessToken);
    const session = await findSessionById(payload.sessionId);
    if (!session) {
      return next(new AppError("Session Expired", 401));
    }

    if (session.revokedAt) {
      return next(new AppError("Session Revoked", 401));
    }

    req.user = payload;
    return next();
  } catch {
    throw new AppError("Invalid or expired Token", 401);
  }
}
