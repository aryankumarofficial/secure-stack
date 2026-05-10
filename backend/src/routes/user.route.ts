import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  loginSchema,
  logoutSchema,
  userSchema,
} from "../validators/user.schema";

const router = Router();

router.post("/register", validate(userSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/logout", validate(logoutSchema), logoutController);

export default router;
