import { z } from "zod";
import { TASK_STATUS } from "../../.generated/prisma/index.js";
import { TASK_PRIORITY } from "../../.generated/prisma/index.js";

export const createTaskSchema = z.object({
  title: z.string(),
  Description: z.string(),
  status: z.enum(TASK_STATUS),
  priority: z.enum(TASK_PRIORITY),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  Description: z.string().optional(),
  status: z.enum(TASK_STATUS).optional(),
  priority: z.enum(TASK_PRIORITY).optional(),
});
