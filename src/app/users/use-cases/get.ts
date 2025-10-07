import { BaseUseCase } from "@shared/use-cases"
import { GetEntityError, NotFoundError } from "@infra/errors"
import { UserRepository } from "../repository"
import { User } from "../types"

export class UserGetUseCase extends BaseUseCase<string, User, GetEntityError> {
  constructor(private repository: UserRepository) {
    super(GetEntityError, "Erro ao buscar o usuário")
  }

  protected async action(userId: string): Promise<User | NotFoundError | GetEntityError> {
    const userExists = await this.repository.get(userId)

    if (!userExists) {
      return new NotFoundError(`Usuário não encontrado.`)
    }

    return userExists
  }
}
