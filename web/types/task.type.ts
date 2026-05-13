export interface Task {
  id: string
  title: string
  Description: string
  userId: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDto {
  title: string
  Description: string
  status?: string
  priority?: string
}

export interface UpdateTaskDto {
  id: string
  title?: string
  Description?: string
  status?: string
  priority?: string
}
