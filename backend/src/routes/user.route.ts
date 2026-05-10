import { Router } from "express";
import { registerController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { userSchema } from "../validators/user.schema";

const router = Router();

router.post("/register", validate(userSchema), registerController);

export default router;
