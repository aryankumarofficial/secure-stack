import { prisma } from "../client";
import type { User } from "../../types/user.type";
import type { ROLE } from "../../.generated/prisma/enums";
export const findUserByEmail = (email: string): Promise<User> => {
  return prisma.user.findFirst({
    where: {
      id: email,
    },
  });
};

export const createUser = (user: User) => {
  return prisma.user.create({
    data: user,
  });
};

export const getUserRoleById = (id: string) => {
  return prisma.user.findFirst({
    where: {
      id,
    },
    select: {
      role: true,
    },
  });
};

export const updateUserRole = (id: string, role: ROLE) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });
};

export const updateUserPassword = (id: string, password: string) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      password,
    },
  });
};
