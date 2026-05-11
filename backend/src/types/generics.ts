import type { ROLE } from "../.generated/prisma/client.js";

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
