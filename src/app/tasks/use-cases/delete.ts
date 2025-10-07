import { BaseUseCase } from "@shared/use-cases"
import { DeleteEntityError, NotFoundError } from "@infra/errors"
import { TaskRepository } from "../repository"

export class TaskDeleteUseCase extends BaseUseCase<string, void, DeleteEntityError> {
  constructor(private repository: TaskRepository) {
    super(DeleteEntityError, "Erro ao deletar a tarefa")
  }

  protected async action(taskId: string): Promise<void | NotFoundError | DeleteEntityError> {
    const taskExists = await this.repository.get(taskId)

    if (!taskExists) {
      return new NotFoundError(`Tarefa não encontrada.`)
    }

    return this.repository.delete(taskId)
  }
}
