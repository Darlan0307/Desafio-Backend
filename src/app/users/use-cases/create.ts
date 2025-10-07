import { BaseUseCase } from "@shared/use-cases"
import { ConflictEntityError, CreateEntityError, InvalidInputError } from "@infra/errors"
import { NewUserData, User } from "../types"
import { UserRepository } from "../repository"
import { UserSchema } from "../schema"

export class UserCreateUseCase extends BaseUseCase<NewUserData, User, CreateEntityError> {
  constructor(private repository: UserRepository) {
    super(CreateEntityError, "Erro ao criar o usuário", UserSchema)
  }

  protected async action(
    data: NewUserData
  ): Promise<User | InvalidInputError | ConflictEntityError | CreateEntityError> {
    const userExists = await this.repository.verifyEmailExists(data.email)

    if (userExists) {
      return new ConflictEntityError(`O email '${data.email}' já está cadastrado no sistema.`)
    }

    return this.repository.save(data)
  }
}
