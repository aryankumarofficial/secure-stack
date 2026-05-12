import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  deleteAllTasks,
} from "../controllers/task.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.schema.js";
const router = Router();

/**
 * @openapi
 * /task:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all tasks
 *     description: Retrieves a list of tasks for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all tasks
 *       401:
 *         description: Unauthorized access
 */
router.get("/", getTasks);

/**
 * @openapi
 * /task/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get a task by ID
 *     description: Retrieves a specific task belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the task
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Task not found
 */
router.get("/:id", getTaskById);

/**
 * @openapi
 * /task:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a new task
 *     description: Creates a new task for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project documentation
 *               description:
 *                 type: string
 *                 example: Write Swagger OpenAPI docs for all routes.
 *               status:
 *                 type: string
 *                 example: PENDING
 *               priority:
 *                 type: string
 *                 example: HIGH
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 */
router.post("/", validate(createTaskSchema), createTask);

/**
 * @openapi
 * /task/{id}:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Update a task
 *     description: Updates an existing task for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Task not found
 */
router.patch("/:id", validate(updateTaskSchema), updateTask);

/**
 * @openapi
 * /task/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete a task
 *     description: Deletes a specific task for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Task not found
 */
router.delete("/:id", deleteTask);

/**
 * @openapi
 * /task:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete all tasks
 *     description: Deletes all tasks belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All tasks deleted successfully
 *       401:
 *         description: Unauthorized access
 */
router.delete("/", deleteAllTasks);

export default router;
