import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { loginUser, logoutUser, registerUser } from "../services/user.service";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";

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

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await loginUser(req.body);

    setAuthCookies(res, accessToken, refreshToken);
    return res.status(200).json({
      success: true,
      message: "Logged In Successfully",
      user,
      accessToken,
      refreshToken,
    });
  },
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    await logoutUser(req.body);
    clearAuthCookies(res);
    return res.status(200).json({
      success: true,
      message: `Logged out Successfully`,
    });
  },
);
