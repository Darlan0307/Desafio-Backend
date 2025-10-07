import { BaseUseCase } from "@shared/use-cases"
import { ListEntityError } from "@infra/errors"
import { UserRepository } from "../repository"
import { User } from "../types"
import { DataListResponse, PaginationRequest } from "@app/global-types"

export class UserListUseCase extends BaseUseCase<
  PaginationRequest,
  DataListResponse<User>,
  ListEntityError
> {
  constructor(private repository: UserRepository) {
    super(ListEntityError, "Erro ao listar os usuários")
  }

  protected async action(
    pagination: PaginationRequest
  ): Promise<DataListResponse<User> | ListEntityError> {
    return this.repository.list(pagination)
  }
}
