import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  rotateRefreshToken,
} from "../services/user.service.js";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies.js";
import { AuthenticatedRequest } from "../types/auth.js";
import { verifyRefreshToken } from "../utils/jwt.js";

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
    const credentials = req.body;
    const { accessToken, refreshToken } = await loginUser(credentials);

    setAuthCookies(res, accessToken, refreshToken);
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      accessToken,
      refreshToken,
    });
  },
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const payload = verifyRefreshToken(refreshToken);
    await logoutUser(payload.sessionId);
    clearAuthCookies(res);
    return res.status(200).json({
      success: true,
      message: `Logged out Successfully`,
    });
  },
);

export const refreshController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const tokens = await rotateRefreshToken(refreshToken);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully",
    });
  },
);

export const getUserInfoController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const data = await fetchUser(user.userId);
    return res.status(200).json({
      success: true,
      user: data,
    });
  },
);
