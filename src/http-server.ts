import express, { Request, Response, Express, Router } from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import { logger } from "@infra/logger"
import { prismaDB } from "@shared/prisma"
import { createUserRoutes } from "@app/users/http"
import { createTaskRoutes } from "@app/tasks/http"

export default class HttpServer {
  private app: Express

  constructor() {
    this.app = express()
  }

  async createApp(): Promise<Express> {
    await prismaDB.$connect()
    this.loadMiddlewares()
    this.loadRoutes()
    return this.app
  }

  async stop(): Promise<void> {
    logger.info("Stopping...")
    await prismaDB.$disconnect()
  }

  private loadMiddlewares(): void {
    this.app.use(cors())

    this.app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
        crossOriginOpenerPolicy: false
      })
    )

    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(compression())
  }

  private loadRoutes(): void {
    this.app.get("/", async (req: Request, res: Response) => {
      res.status(200).json({ message: "API - Gerenciador de usuários e tarefas" })
    })

    this.app.get("/health", async (req: Request, res: Response) => {
      res.status(200).json({
        ok: true,
        message: "serviço está funcionando"
      })
    })

    const router = Router()
    this.app.use(router)
    createUserRoutes(router)
    createTaskRoutes(router)
  }
}
