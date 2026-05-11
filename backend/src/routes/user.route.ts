import { Router } from "express";
import {
  getUserInfoController,
  loginController,
  logoutController,
  refreshController,
  registerController,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  logoutSchema,
  userSchema,
} from "../validators/user.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(userSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/refresh", refreshController);
router.post("/logout", validate(logoutSchema), logoutController);
router.get("/me", authMiddleware, getUserInfoController);

export default router;
