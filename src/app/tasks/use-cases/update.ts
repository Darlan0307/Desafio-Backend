import { BaseUseCase } from "@shared/use-cases"
import { InvalidInputError, NotFoundError, UpdateEntityError } from "@infra/errors"
import { Task, UpdateTaskData } from "../types"
import { TaskRepository } from "../repository"
import { TaskPatchSchema } from "../schema"

type UseCaseErrors = InvalidInputError | NotFoundError | UpdateEntityError

export class TaskUpdateUseCase extends BaseUseCase<UpdateTaskData, Task, UpdateEntityError> {
  constructor(private repository: TaskRepository) {
    super(UpdateEntityError, "Erro ao atualizar a tarefa", TaskPatchSchema)
  }

  protected async action(taskId: string, data: UpdateTaskData): Promise<Task | UseCaseErrors> {
    const taskExists = await this.repository.get(taskId)

    if (!taskExists) {
      return new NotFoundError(`Tarefa não encontrada.`)
    }

    return this.repository.update(taskId, data)
  }
}
