import type { Request } from "express";
import type { JwtPayload } from "./generics.js";

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
