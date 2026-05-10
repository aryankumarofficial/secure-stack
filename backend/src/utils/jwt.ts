import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/generics";
const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === "string") throw new Error("Invalid token payload");
  return decoded as JwtPayload;
};
