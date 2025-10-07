import { BaseUseCase } from "@shared/use-cases"
import { InvalidInputError, NotFoundError, UpdateEntityError } from "@infra/errors"
import { Task, UpdateTaskData } from "../types"
import { TaskRepository } from "../repository"
import { TaskPatchSchema } from "../schema"
import { UserRepository } from "@app/users/repository"

type UseCaseErrors = InvalidInputError | NotFoundError | UpdateEntityError

export class TaskUpdateUseCase extends BaseUseCase<UpdateTaskData, Task, UpdateEntityError> {
  constructor(
    private userRepository: UserRepository,
    private taskRepository: TaskRepository
  ) {
    super(UpdateEntityError, "Erro ao atualizar a tarefa", TaskPatchSchema)
  }

  protected async action(taskId: string, data: UpdateTaskData): Promise<Task | UseCaseErrors> {
    const taskExists = await this.taskRepository.get(taskId)

    if (!taskExists) {
      return new NotFoundError(`Tarefa não encontrada.`)
    }

    if (data?.userId?.trim()) {
      const userExists = await this.userRepository.get(data.userId)

      if (!userExists) {
        return new NotFoundError(`Usuário não encontrado.`)
      }
    }

    return this.taskRepository.update(taskId, data)
  }
}
