import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchAllUsers, updateRole } from "../services/admin.service.js";
import { AuthenticatedRequest } from "../types/auth.js";
import { Response, NextFunction } from "express";
import { ROLE } from "../../.generated/prisma/index.js";
import AppError from "../utils/AppError.js";
import { omit } from "../utils/object.js";

type Params = {
  userId: string;
};

export const getAllUsersController = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response) => {
    const users = await fetchAllUsers();
    res.json(users);
  },
);

export const updateRoleController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params as Params;
    const { role } = req.body;
    if (req.user.userId === userId && role === ROLE.ADMIN)
      return next(new AppError("You cannot remove your own admin access", 403));
    const updatedUser = await updateRole(userId, role);
    res.json(omit(updatedUser, "password"));
  },
);

export const updateUserBlockStatusController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params as Params;
    const { isBlocked } = req.body;
    if (req.user.userId === userId)
      return next(new AppError("You cannot block yourself", 403));
    const updatedUser = await updateRole(userId, isBlocked);
    res.json(omit(updatedUser, "password"));
  },
);
