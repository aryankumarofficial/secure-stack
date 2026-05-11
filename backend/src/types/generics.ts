import { ROLE } from "../../.generated/prisma/index.js";

export type RequireAtLeastOne<
  T,
  Keys extends keyof T = keyof T,
> = Keys extends keyof T
  ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
  : never;

export type JwtPayload = {
  userId: string;
  role: ROLE;
  sessionId: string;
};
