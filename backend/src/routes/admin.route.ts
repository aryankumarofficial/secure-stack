import { Router } from "express";
import {
  getAllUsersController,
  updateRoleController,
  updateUserBlockStatusController,
} from "../controllers/admin.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  toogleBlockUserSchema,
  updateRoleSchema,
} from "../validators/admin.schema.js";
import { ro } from "zod/locales";

const router = Router();

router.get("/users", getAllUsersController);
router.patch(
  "/users/:userId/role",
  validate(updateRoleSchema),
  updateRoleController,
);
router.patch(
  "/users/:userId/block",
  validate(toogleBlockUserSchema),
  updateUserBlockStatusController,
);
export default router;
