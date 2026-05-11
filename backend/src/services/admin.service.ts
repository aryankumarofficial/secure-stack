import { ROLE } from "../../.generated/prisma/index.js";
import {
  getUserInfoById,
  getUsers,
  updateUserBlockStatus,
  updateUserRole,
} from "../db/repository/user.repo.js";
import AppError from "../utils/AppError.js";

export async function fetchAllUsers() {
  return await getUsers();
}

export async function updateRole(userId: string, role: ROLE) {
  const user = await getUserInfoById(userId);
  if (!user) throw new AppError("User not found", 404);
  const updatedUser = await updateUserRole(userId, role);
  return updatedUser;
}

export async function toggleBlockUser(userId: string, isBlocked: boolean) {
  const user = await getUserInfoById(userId);
  if (!user) throw new AppError("User not found", 404);
  const updatedUser = await updateUserBlockStatus(userId, isBlocked);
  return updatedUser;
}
