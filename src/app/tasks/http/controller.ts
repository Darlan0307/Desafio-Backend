import {
  created,
  createPaginationRequest,
  HttpRequest,
  HttpResponse,
  makeResponse,
  noContent,
  removeUndefinedFields
} from "@shared/http"
import {
  TaskCreateUseCase,
  TaskDeleteUseCase,
  TaskGetUseCase,
  TaskListUseCase,
  TaskUpdateUseCase
} from "../use-cases"

export type UseCases = {
  save: TaskCreateUseCase
  update: TaskUpdateUseCase
  delete: TaskDeleteUseCase
  list: TaskListUseCase
  get: TaskGetUseCase
}

export default class TaskHttpController {
  constructor(private useCases: UseCases) {}

  async create(request: HttpRequest): Promise<HttpResponse> {
    const data = removeUndefinedFields(request?.body ?? {})

    const result = await this.useCases.save.execute(data)

    return makeResponse(result, created)
  }

  async update(request: HttpRequest): Promise<HttpResponse> {
    const id = request?.params?.id ?? ""
    const data = removeUndefinedFields(request?.body ?? {})

    const result = await this.useCases.update.execute(id, data)

    return makeResponse(result)
  }

  async get(request: HttpRequest): Promise<HttpResponse> {
    const id = request?.params?.id ?? ""

    const result = await this.useCases.get.execute(id)

    return makeResponse(result)
  }

  async delete(request: HttpRequest): Promise<HttpResponse> {
    const id = request?.params?.id ?? ""

    const result = await this.useCases.delete.execute(id)

    return makeResponse(result, noContent)
  }

  async list(request: HttpRequest): Promise<HttpResponse> {
    const pagination = createPaginationRequest(request)

    const result = await this.useCases.list.execute(pagination)

    return makeResponse(result)
  }
}
