import { BaseUseCase } from "@shared/use-cases"
import { DeleteEntityError, NotFoundError } from "@infra/errors"
import { UserRepository } from "../repository"

export class UserDeleteUseCase extends BaseUseCase<string, void, DeleteEntityError> {
  constructor(private repository: UserRepository) {
    super(DeleteEntityError, "Erro ao deletar o usuário")
  }

  protected async action(userId: string): Promise<void | NotFoundError | DeleteEntityError> {
    const userExists = await this.repository.get(userId)

    if (userExists) {
      return new NotFoundError(`Usuário não encontrado.`)
    }

    return this.repository.delete(userId)
  }
}
