import { BaseUseCase } from "@shared/use-cases"
import {
  ConflictEntityError,
  InvalidInputError,
  NotFoundError,
  UpdateEntityError
} from "@infra/errors"
import { UpdateUserData, User } from "../types"
import { UserRepository } from "../repository"
import { UserPatchSchema } from "../schema"

type UseCaseErrors = InvalidInputError | ConflictEntityError | NotFoundError | UpdateEntityError

export class UserPatchUseCase extends BaseUseCase<UpdateUserData, User, UpdateEntityError> {
  constructor(private repository: UserRepository) {
    super(UpdateEntityError, "Erro ao atualizar o usuário", UserPatchSchema)
  }

  protected async action(userId: string, data: UpdateUserData): Promise<User | UseCaseErrors> {
    const userExists = await this.repository.get(userId)

    if (!userExists) {
      return new NotFoundError(`Usuário não encontrado.`)
    }

    if (data?.email?.trim()) {
      const userExists = await this.repository.verifyEmailExists(data.email, userId)

      if (userExists) {
        return new ConflictEntityError(`O email '${data.email}' já está cadastrado no sistema.`)
      }
    }

    return this.repository.update(userId, data)
  }
}
