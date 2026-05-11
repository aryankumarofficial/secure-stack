import { prisma } from "../client.js";
import type { User, UserCreateDTO } from "../../types/user.type.js";
import { generateToken, sessionExpiryMinutes } from "../../utils/token.js";
import { hash } from "../../utils/hash.js";
import { ROLE } from "../../../.generated/prisma/index.js";
import { clearUserSession } from "./session.repo.js";
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const createUser = async (user: UserCreateDTO) => {
  const { newUser, rowToken } = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: user,
    });
    const rowToken = generateToken();
    const hashToken = await hash(rowToken);
    await tx.token.create({
      data: {
        user: {
          connect: {
            id: newUser.id,
          },
        },
        token: hashToken,
        type: "EMAIL_VERIFICATION",
        expiredAt: sessionExpiryMinutes(30),
      },
    });
    return { newUser, rowToken };
  });
  return { user: newUser, rowToken };
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

export const getUserInfoById = (id: string) => {
  return prisma.user.findFirst({
    where: {
      id,
    },
    omit: {
      password: true,
    },
  });
};

export const getUsers = async () => {
  return await prisma.user.findMany({
    omit: {
      password: true,
    },
  });
};

export const updateUserBlockStatus = async (id: string, isBlocked: boolean) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isBlocked,
    },
  });

  if (user.isBlocked) {
    await clearUserSession(user.id);
  }

  return user;
};
