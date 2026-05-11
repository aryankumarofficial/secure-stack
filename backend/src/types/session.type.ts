export type { Session } from "../.generated/prisma/client.js";
import { Prisma } from "../.generated/prisma/client.js";

export type SessionCreateDTO = Pick<
  Prisma.SessionUncheckedCreateInput,
  "userId" | "refreshToken" | "expiresAt"
>;

export type SessionUpdateDTO = Required<
  Pick<Prisma.SessionUpdateInput, "refreshToken" | "expiresAt">
>;
