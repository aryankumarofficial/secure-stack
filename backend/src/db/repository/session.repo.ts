import { prisma } from "../client";
import type { SessionCreateDTO } from "../../types/session.type";
import { generateToken, sessionExpiry } from "../../utils/token";

export const createUserSession = async (userId: string) => {
  return await prisma.session.create({
    data: {
      token: generateToken(),
      expiredAt: sessionExpiry(3),
      userId,
    },
    include: {
      user: true,
    },
  });
};

export const clearUserSession = async (userId: string) => {
  return await prisma.session.deleteMany({
    where: {
      userId,
    },
  });
};
