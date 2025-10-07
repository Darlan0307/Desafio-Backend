import { DataListResponse, PaginationRequest } from "@app/global-types"
import { NewTaskData, Task, UpdateTaskData } from "../types"

export interface TaskRepository {
  save(user: NewTaskData): Promise<Task>
  update(id: string, user: UpdateTaskData): Promise<Task>
  delete(id: string): Promise<void>
  get(id: string): Promise<Task | null>
  list(pagination: PaginationRequest): Promise<DataListResponse<Task>>
}
