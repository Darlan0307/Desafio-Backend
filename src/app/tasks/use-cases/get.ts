import { BaseUseCase } from "@shared/use-cases"
import { GetEntityError, NotFoundError } from "@infra/errors"
import { Task } from "../types"
import { TaskRepository } from "../repository"

export class TaskGetUseCase extends BaseUseCase<string, Task, GetEntityError> {
  constructor(private repository: TaskRepository) {
    super(GetEntityError, "Erro ao buscar a tarefa")
  }

  protected async action(taskId: string): Promise<Task | NotFoundError | GetEntityError> {
    const taskExists = await this.repository.get(taskId)

    if (!taskExists) {
      return new NotFoundError(`Tarefa não encontrada.`)
    }

    return taskExists
  }
}
