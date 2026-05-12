import { Router } from "express";
import {
  analyticsController,
  getAllUsersController,
  updateRoleController,
  updateUserBlockStatusController,
  userDetailsController,
} from "../controllers/admin.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  toogleBlockUserSchema,
  updateRoleSchema,
} from "../validators/admin.schema.js";

const router = Router();

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users
 *     description: Retrieves a list of all users in the system. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get("/users", getAllUsersController);

/**
 * @openapi
 * /admin/users/{userId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get user details
 *     description: Retrieves detailed information about a specific user. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 */
router.get("/users/:userId", userDetailsController);

/**
 * @openapi
 * /admin/users/{userId}/role:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update user role
 *     description: Updates the role of a specific user. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden - Admin role required or cannot remove own admin access
 *       404:
 *         description: User not found
 */
router.patch(
  "/users/:userId/role",
  validate(updateRoleSchema),
  updateRoleController,
);

/**
 * @openapi
 * /admin/users/{userId}/block:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Toggle user block status
 *     description: Blocks or unblocks a specific user. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to block/unblock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isBlocked
 *             properties:
 *               isBlocked:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User block status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 */
router.patch(
  "/users/:userId/block",
  validate(toogleBlockUserSchema),
  updateUserBlockStatusController,
);

/**
 * @openapi
 * /admin/analytics:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get system analytics
 *     description: Retrieves system-wide analytics and statistics. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved analytics data
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get("/analytics", analyticsController);

export default router;
