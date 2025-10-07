import { Router } from "express"
import { Request, Response } from "express"
import { PrismaUserRepository } from "../repository"
import UserHttpController from "./controller"
import {
  UserCreateUseCase,
  UserDeleteUseCase,
  UserGetUseCase,
  UserListUseCase,
  UserUpdateUseCase
} from "../use-cases"

export function createUserRoutes(router: Router) {
  const userRepository = new PrismaUserRepository()

  const controller = new UserHttpController({
    get: new UserGetUseCase(userRepository),
    save: new UserCreateUseCase(userRepository),
    update: new UserUpdateUseCase(userRepository),
    delete: new UserDeleteUseCase(userRepository),
    list: new UserListUseCase(userRepository)
  })

  router.post("/users", async (req: Request, res: Response) => {
    const httpResponse = await controller.create(req)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  })

  router.put("/users/:id", async (req: Request, res: Response) => {
    const httpResponse = await controller.update(req)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  })

  router.delete("/users/:id", async (req: Request, res: Response) => {
    const httpResponse = await controller.delete(req)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  })

  router.get("/users/:id", async (req: Request, res: Response) => {
    const httpResponse = await controller.get(req)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  })

  router.get("/users", async (req: Request, res: Response) => {
    const httpResponse = await controller.list(req)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  })
}
