import { prisma } from "../client.js";
import { CreateTaskDTO, Task, UpdateTaskDTO } from "../../types/task.type.js";

export class TaskRepository {
  async create(data: CreateTaskDTO): Promise<Task> {
    const task = await prisma.task.create({
      data,
    });
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });
    return task;
  }

  async findAll(userId: string): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
    return tasks;
  }

  async update(id: string, data: UpdateTaskDTO): Promise<Task | null> {
    const task = await prisma.task.update({
      where: { id },
      data,
    });
    return task;
  }

  async delete(id: string): Promise<Task | null> {
    const task = await prisma.task.delete({
      where: { id },
    });
    return task;
  }
}
