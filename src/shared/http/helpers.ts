/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "@infra/logger"
import { HttpRequest, HttpResponse } from "./http-response"
import {
  ConflictEntityError,
  CreateEntityError,
  DeleteEntityError,
  GetEntityError,
  InvalidInputError,
  ListEntityError,
  NotFoundError,
  UpdateEntityError
} from "@infra/errors"
import { PaginationRequest } from "@app/global-types"

export const badRequest = (error: Error, data: any = null): HttpResponse => {
  if (!data) {
    return {
      statusCode: 400,
      body: { errorMessage: error.message }
    }
  }

  return {
    statusCode: 400,
    body: { errorMessage: error.message, data }
  }
}

export const notFound = (error?: Error): HttpResponse => ({
  statusCode: 404,
  body: { errorMessage: error?.message || "not found" }
})

export const ok = (data: any = {}): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const created = (data: any = {}): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const noContent = (): Omit<HttpResponse, "body"> => ({
  statusCode: 204
})

export const serverError = (error: Error | unknown): HttpResponse => {
  if (error instanceof Error) {
    logger.error(error)
    return {
      statusCode: 500,
      body: { errorMessage: error.message }
    }
  }

  return {
    statusCode: 500,
    body: { errorMessage: "Problemas em processar a requisição pelo servidor" }
  }
}

export const conflict = (error?: Error): HttpResponse => ({
  statusCode: 409,
  body: { errorMessage: error?.message || "conflict" }
})

export function removeUndefinedFields<T extends Record<string, any>>(input: T): T {
  if (!input) {
    return {} as T
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.fromEntries(Object.entries(input).filter(([_, value]) => value !== undefined)) as T
}

export const createPaginationRequest = (req: HttpRequest): PaginationRequest => {
  let page = Number(req?.query?.page ?? 1)
  if (isNaN(page) || page < 1) {
    page = 1
  }

  let perPage = Number(req?.query?.perPage ?? 50)
  if (isNaN(perPage) || perPage < 1) {
    perPage = 50
  }

  const withDeleted = req?.query?.withDeleted
    ? req?.query?.withDeleted.toString() === "true" || req?.query?.withDeleted.toString() === "1"
    : false

  return {
    page,
    perPage,
    withDeleted
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function makeResponse(result: any, cb: Function | null = ok): any {
  const errorMap = new Map([
    [NotFoundError, notFound],
    [InvalidInputError, badRequest],
    [ConflictEntityError, conflict],
    [UpdateEntityError, serverError],
    [CreateEntityError, serverError],
    [GetEntityError, serverError],
    [DeleteEntityError, serverError],
    [ListEntityError, serverError]
  ])

  for (const [ErrorType, responseFunc] of errorMap) {
    if (result instanceof ErrorType) {
      return responseFunc(result)
    }
  }

  return cb ? cb(result) : noContent()
}
