import type { JwtPayload } from "./generics.js";
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
