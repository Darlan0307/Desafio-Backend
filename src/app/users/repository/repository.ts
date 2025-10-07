import { DataListResponse, PaginationRequest } from "@app/global-types"
import { NewUserData, UpdateUserData, User } from "../types"

export interface UserRepository {
  save(user: NewUserData): Promise<User>
  update(id: string, user: UpdateUserData): Promise<User>
  delete(id: string): Promise<void>
  get(id: string): Promise<User | null>
  list(pagination: PaginationRequest): Promise<DataListResponse<User>>
}
