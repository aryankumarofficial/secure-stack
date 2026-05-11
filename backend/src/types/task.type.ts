export { Task } from "../../.generated/prisma/index.js";
import { Prisma } from "../../.generated/prisma/index.js";

export type CreateTaskDTO = Pick<
  Prisma.TaskUncheckedCreateInput,
  "title" | "Description" | "priority" | "status" | "userId"
>;

export type UpdateTaskDTO = Pick<
  Prisma.TaskUncheckedUpdateInput,
  "title" | "Description" | "priority" | "status"
>;
