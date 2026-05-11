import { z } from "zod";
import { ROLE } from "../../.generated/prisma/index.js";
export const updateRoleSchema = z.object({
  role: z.enum(ROLE),
});

export const toogleBlockUserSchema = z.object({
  isBlocked: z.boolean(),
});
