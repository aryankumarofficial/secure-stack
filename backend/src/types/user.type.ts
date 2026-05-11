export type { User } from "../../.generated/prisma/client.js";
import type { Prisma } from "../../.generated/prisma/client.js";

export type UserCreateDTO = Pick<
  Prisma.UserCreateInput,
  "name" | "email" | "password"
>;
export type UpdateUserDTO = Pick<Prisma.UserUpdateInput, "id" | "role">;

export type UserLoginDTO = Pick<UserCreateDTO, "email" | "password">;
