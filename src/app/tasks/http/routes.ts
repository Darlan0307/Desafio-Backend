import { Router } from "express"
import { Request, Response } from "express"
import { PrismaTaskRepository } from "../repository"
import TaskHttpController from "./controller"
import {
  TaskCreateUseCase,
  TaskDeleteUseCase,
  TaskGetUseCase,
  TaskListUseCase,
  TaskUpdateUseCase
} from "../use-cases"
import { PrismaUserRepository } from "@app/users/repository"

export function createTaskRoutes(router: Router) {
  const userRepository = new PrismaUserRepository()
  const taskRepository = new PrismaTaskRepository()

  const controller = new TaskHttpController({
    get: new TaskGetUseCase(taskRepository),
    save: new TaskCreateUseCase(userRepository, taskRepository),
    update: new TaskUpdateUseCase(userRepository, taskRepository),
    delete: new TaskDeleteUseCase(taskRepository),
    list: new TaskListUseCase(taskRepository)
  })

  router.post("/tasks", async (req: Request, res: Response) => {
    const httpResponse = await controller.create(req)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  })

  router.put("/tasks/:id", async (req: Request, res: Response) => {
    const httpResponse = await controller.update(req)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  })

  router.delete("/tasks/:id", async (req: Request, res: Response) => {
    const httpResponse = await controller.delete(req)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  })

  router.get("/tasks/:id", async (req: Request, res: Response) => {
    const httpResponse = await controller.get(req)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  })

  router.get("/tasks", async (req: Request, res: Response) => {
    const httpResponse = await controller.list(req)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  })
}
