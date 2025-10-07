import {
  CreateEntityError,
  DeleteEntityError,
  GetEntityError,
  ListEntityError,
  UpdateEntityError
} from "@infra/errors"
import { DataListResponse, PaginationRequest } from "@app/global-types"
import { BuildPagination, prismaDB } from "@shared/prisma"
import { TaskRepository } from "./repository"
import { NewTaskData, Task, TaskStatus, UpdateTaskData } from "../types"
import { Tasks as PrismaTasks } from "@prisma/client"
import { User } from "@app/users/types"

export class PrismaTaskRepository implements TaskRepository {
  async save(tasks: NewTaskData): Promise<Task> {
    try {
      const newTask = await prismaDB.tasks.create({
        data: tasks,
        include: {
          user: true
        }
      })

      return this.mapToResponse(newTask)
    } catch (error) {
      throw new CreateEntityError("Erro ao criar a tarefa: " + JSON.stringify(error))
    }
  }

  async update(id: string, user: UpdateTaskData): Promise<Task> {
    try {
      const taskUpdated = await prismaDB.tasks.update({
        where: { id },
        data: user,
        include: {
          user: true
        }
      })

      return this.mapToResponse(taskUpdated)
    } catch (error) {
      throw new UpdateEntityError("Erro ao atualizar a tarefa: " + JSON.stringify(error))
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prismaDB.tasks.update({
        where: { id },
        data: { deletedAt: new Date() }
      })
      return
    } catch (error) {
      throw new DeleteEntityError("Erro ao deletar tafera: " + JSON.stringify(error))
    }
  }

  async get(id: string): Promise<Task | null> {
    try {
      const task = await prismaDB.tasks.findUnique({
        where: { id },
        include: {
          user: true
        }
      })

      if (!task) {
        return null
      }

      return this.mapToResponse(task)
    } catch (error) {
      throw new GetEntityError("Erro ao buscar tarefa: " + JSON.stringify(error))
    }
  }

  async list(pagination: PaginationRequest): Promise<DataListResponse<Task>> {
    const { firstPosition, perPage, whereCondition } = BuildPagination(pagination)
    try {
      const [totalRecords, tasks] = await Promise.all([
        prismaDB.tasks.count({
          where: whereCondition
        }),
        prismaDB.tasks.findMany({
          where: whereCondition,
          take: perPage,
          skip: firstPosition,
          include: {
            user: true
          }
        })
      ])

      const totalPages = Math.ceil(totalRecords / perPage)

      return {
        data: tasks.map((task) => this.mapToResponse(task)),
        totalPages,
        totalRecords,
        currentPage: pagination.page,
        perPage
      }
    } catch (error) {
      throw new ListEntityError("Erro ao listar as tarefas: " + JSON.stringify(error))
    }
  }

  private mapToResponse(task: PrismaTasks & { user: User }): Task {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...rest } = task
    return {
      ...rest,
      status: TaskStatus[rest.status],
      user: {
        id: rest.user.id,
        name: rest.user.name
      }
    }
  }
}
