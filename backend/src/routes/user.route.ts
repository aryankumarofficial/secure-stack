import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, userSchema } from "../validators/user.schema";

const router = Router();

router.post("/register", validate(userSchema), registerController);
router.post("/login", validate(loginSchema), loginController);

export default router;
