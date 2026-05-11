import type { NextFunction, Request, Response } from "express";

import { TaskService } from "../services/task.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { TaskRepository } from "../db/repository/task.repo.js";
import { AuthenticatedRequest } from "../types/auth.js";

const taskService = new TaskService(new TaskRepository());

type Params = {
  id: string;
};

export const createTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const task = await taskService.createTask({ ...req.body, userId });

    return res.status(201).json({
      success: true,
      task,
    });
  },
);

export const getTaskById = asyncHandler(
  async (req: Request<Params>, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const task = await taskService.getTaskById(id);

    return res.status(200).json({
      success: true,
      task,
    });
  },
);

export const updateTask = asyncHandler(
  async (req: Request<Params>, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const task = await taskService.updateTask(id, req.body);

    return res.status(200).json({
      success: true,
      task,
    });
  },
);

export const deleteTask = asyncHandler(
  async (req: Request<Params>, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    await taskService.deleteTask(id);

    return res.status(200).json({
      success: true,
    });
  },
);

export const getTasks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const task = await taskService.getTasks(userId);

    return res.status(200).json({
      success: true,
      task,
    });
  },
);

export const deleteAllTasks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const count = await taskService.deleteAll(userId);

    return res.status(200).json({
      success: true,
      count,
    });
  },
);
