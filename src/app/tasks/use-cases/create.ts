import { BaseUseCase } from "@shared/use-cases"
import { CreateEntityError, InvalidInputError, NotFoundError } from "@infra/errors"
import { NewTaskData, Task } from "../types"
import { TaskSchema } from "../schema"
import { TaskRepository } from "../repository"
import { UserRepository } from "@app/users/repository"

type UseCaseErrors = InvalidInputError | NotFoundError | CreateEntityError
export class TaskCreateUseCase extends BaseUseCase<NewTaskData, Task, CreateEntityError> {
  constructor(
    private userRepository: UserRepository,
    private taskRepository: TaskRepository
  ) {
    super(CreateEntityError, "Erro ao criar a tarefa", TaskSchema)
  }

  protected async action(data: NewTaskData): Promise<Task | UseCaseErrors> {
    const userExists = await this.userRepository.get(data.userId)

    if (!userExists) {
      return new NotFoundError(`Usuário não encontrado.`)
    }

    return this.taskRepository.save(data)
  }
}
