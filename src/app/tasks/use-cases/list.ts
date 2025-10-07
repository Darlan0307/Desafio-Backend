import { BaseUseCase } from "@shared/use-cases"
import { ListEntityError } from "@infra/errors"
import { Task } from "../types"
import { DataListResponse, PaginationRequest } from "@app/global-types"
import { TaskRepository } from "../repository"

export class TaskListUseCase extends BaseUseCase<
  PaginationRequest,
  DataListResponse<Task>,
  ListEntityError
> {
  constructor(private repository: TaskRepository) {
    super(ListEntityError, "Erro ao listar as tarefas")
  }

  protected async action(
    pagination: PaginationRequest
  ): Promise<DataListResponse<Task> | ListEntityError> {
    return this.repository.list(pagination)
  }
}
