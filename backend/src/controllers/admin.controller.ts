import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchAllUsers } from "../services/admin.service.js";
import { AuthenticatedRequest } from "../types/auth.js";
import { Response } from "express";

export const getAllUsersController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const users = await fetchAllUsers();
    res.json(users);
  },
);
