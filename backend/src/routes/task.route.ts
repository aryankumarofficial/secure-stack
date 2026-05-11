import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} from "../controllers/task.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.schema.js";
const router = Router();

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", validate(createTaskSchema), createTask);
router.patch("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
