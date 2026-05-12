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

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new user account and registers them into the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post("/register", validate(userSchema), registerController);

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticates a user and issues session tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123!
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginSchema), loginController);

/**
 * @openapi
 * /user/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Generates a new access token using a valid refresh token cookie.
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", refreshController);

/**
 * @openapi
 * /user/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     description: Clears the user's authentication session and removes cookies.
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", logoutController);

/**
 * @openapi
 * /user/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user profile
 *     description: Returns the authenticated user's information.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized access
 */
router.get("/me", authMiddleware, getUserInfoController);

export default router;
