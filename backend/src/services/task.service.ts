import { TaskRepository } from "../db/repository/task.repo.js";
import { UpdateTaskDTO, Task, CreateTaskDTO } from "../types/task.type.js";
import AppError from "../utils/AppError.js";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async getTasks(userId: string): Promise<Task[]> {
    return this.taskRepository.findAll(userId);
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task | null> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new AppError("Task not found", 404);

    return this.taskRepository.update(id, data);
  }

  async deleteTask(id: string): Promise<Task | null> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new AppError("Task not found", 404);

    return this.taskRepository.delete(id);
  }

  async createTask(data: CreateTaskDTO): Promise<Task> {
    try {
      return this.taskRepository.create(data);
    } catch {
      throw new AppError("Failed to create task", 500);
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new AppError("Task not found", 404);

    return task;
  }
}
