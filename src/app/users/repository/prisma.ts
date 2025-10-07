import {
  CreateEntityError,
  DeleteEntityError,
  GetEntityError,
  ListEntityError,
  UpdateEntityError
} from "@infra/errors"
import { NewUserData, UpdateUserData, User } from "../types"
import { UserRepository } from "./repository"
import { DataListResponse, PaginationRequest } from "@app/global-types"
import { BuildPagination, prismaDB } from "@shared/prisma"

export class PrismaUserRepository implements UserRepository {
  async save(user: NewUserData): Promise<User> {
    try {
      return prismaDB.user.create({
        data: user
      })
    } catch (error) {
      throw new CreateEntityError("Erro ao criar usuário: " + JSON.stringify(error))
    }
  }

  async update(id: string, user: UpdateUserData): Promise<User> {
    try {
      return prismaDB.user.update({
        where: { id },
        data: user
      })
    } catch (error) {
      throw new UpdateEntityError("Erro ao atualizar usuário: " + JSON.stringify(error))
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prismaDB.user.update({
        where: { id },
        data: { deletedAt: new Date() }
      })
      return
    } catch (error) {
      throw new DeleteEntityError("Erro ao deletar usuário: " + JSON.stringify(error))
    }
  }

  async get(id: string): Promise<User | null> {
    try {
      return prismaDB.user.findUnique({
        where: { id }
      })
    } catch (error) {
      throw new GetEntityError("Erro ao buscar usuário: " + JSON.stringify(error))
    }
  }

  async verifyEmailExists(email: string, ignoreThisId?: string): Promise<User | null> {
    try {
      return prismaDB.user.findUnique({
        where: {
          NOT: { id: ignoreThisId },
          email
        }
      })
    } catch (error) {
      throw new GetEntityError("Erro ao buscar usuário pelo email: " + JSON.stringify(error))
    }
  }

  async list(pagination: PaginationRequest): Promise<DataListResponse<User>> {
    const { firstPosition, perPage, whereCondition } = BuildPagination(pagination)
    try {
      const [totalRecords, users] = await Promise.all([
        prismaDB.user.count({
          where: whereCondition
        }),
        prismaDB.user.findMany({
          where: whereCondition,
          take: perPage,
          skip: firstPosition
        })
      ])

      const totalPages = Math.ceil(totalRecords / perPage)

      return {
        data: users,
        totalPages,
        totalRecords,
        currentPage: pagination.page,
        perPage
      }
    } catch (error) {
      throw new ListEntityError("Erro ao listar usuários: " + JSON.stringify(error))
    }
  }
}
