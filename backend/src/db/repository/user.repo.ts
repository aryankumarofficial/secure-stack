import { prisma } from "../client";
import type { User, UserCreateDTO } from "../../types/user.type";
import type { ROLE } from "../../.generated/prisma";
import { generateToken, sessionExpiryMinutes } from "../../utils/token";
import { hash } from "../../utils/hash";
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      email,
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
