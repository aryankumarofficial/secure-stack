import type { JwtPayload } from "./generics";
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
