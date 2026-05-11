import { prisma } from "../client.js";
import type {
  SessionCreateDTO,
  SessionUpdateDTO,
} from "../../types/session.type.js";

export const createUserSession = async (payload: SessionCreateDTO) => {
  return await prisma.session.create({
    data: payload,
  });
};

export const findSessionById = async (id: string) => {
  return await prisma.session.findUnique({
    where: {
      id,
    },
  });
};

export async function updateSession(id: string, data: SessionUpdateDTO) {
  return prisma.session.update({
    where: {
      id,
    },
    data: {
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
    },
  });
}

export async function deleteSession(id: string) {
  return prisma.session.delete({
    where: {
      id,
    },
  });
}

export async function clearUserSession(userId: string) {
  return prisma.session.deleteMany({
    where: {
      userId,
    },
  });
}
