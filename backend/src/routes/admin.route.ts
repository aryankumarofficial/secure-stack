import { Router } from "express";
import { getAllUsersController } from "../controllers/admin.controller.js";

const router = Router();

router.get("/users", getAllUsersController);


export default router;
