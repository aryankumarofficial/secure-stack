export type { User } from "../.generated/prisma/client";
import type { Prisma } from "../.generated/prisma/client";

export type UserCreateDTO = Pick<
  Prisma.UserCreateInput,
  "name" | "email" | "password"
>;
export type UpdateUserDTO = Pick<Prisma.UserUpdateInput, "id" | "role">;
