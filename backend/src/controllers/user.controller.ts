import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { registerUser } from "../services/user.service";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await registerUser(req.body);
    return res.status(201).json({
      success: true,
      message: `User Registered Successfully`,
      user,
    });
  },
);
