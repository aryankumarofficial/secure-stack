import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { registerUser } from "../services/user.service";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await registerUser(req.body);
    return res.status(201).json({
      success: true,
      message:
        "Account created successfully. Please verify your email address to activate your account.",
      user,
    });
  },
);
