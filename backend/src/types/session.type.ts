export type { Session } from "../.generated/prisma/client";
import { Prisma } from "../.generated/prisma/client";

export type SessionCreateDTO = Pick<
  Prisma.SessionUncheckedCreateInput,
  "userId" | "token" | "expiredAt"
>;
