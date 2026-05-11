import { Router } from "express";
import userRoutes from "./user.route.js";
import adminRoutes from "./admin.route.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const rootRouter = Router();

rootRouter.use("/user", userRoutes);
rootRouter.use("/admin", authMiddleware, adminMiddleware, adminRoutes);

export default rootRouter;
