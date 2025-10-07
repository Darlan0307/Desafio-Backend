export enum TaskStatus {
  pending = "pending",
  completed = "completed"
}

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  user: {
    id: string
    name: string
  }
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type NewTaskData = {
  title: string
  description: string
  userId: string
}

export type UpdateTaskData = Partial<NewTaskData> & { status: TaskStatus }
