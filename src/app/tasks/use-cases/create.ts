import { BaseUseCase } from "@shared/use-cases"
import { CreateEntityError, InvalidInputError } from "@infra/errors"
import { NewTaskData, Task } from "../types"
import { TaskSchema } from "../schema"
import { TaskRepository } from "../repository"

export class TaskCreateUseCase extends BaseUseCase<NewTaskData, Task, CreateEntityError> {
  constructor(private repository: TaskRepository) {
    super(CreateEntityError, "Erro ao criar a tarefa", TaskSchema)
  }

  protected async action(data: NewTaskData): Promise<Task | InvalidInputError | CreateEntityError> {
    return this.repository.save(data)
  }
}
