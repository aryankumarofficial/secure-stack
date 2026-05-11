import { Router } from "express";
import {
  getAllUsersController,
  updateRoleController,
} from "../controllers/admin.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateRoleSchema } from "../validators/admin.schema.js";

const router = Router();

router.get("/users", getAllUsersController);
router.patch(
  "/users/:userId/role",
  validate(updateRoleSchema),
  updateRoleController,
);

export default router;
