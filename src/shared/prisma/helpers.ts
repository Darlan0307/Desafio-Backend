import { PaginationRequest } from "@app/global-types"

type PaginationResult = {
  firstPosition: number
  perPage: number
  whereCondition: {
    deletedAt?: null
  }
}

export const BuildPagination = (paginationRequest: PaginationRequest): PaginationResult => {
  let pageNumber = Number(paginationRequest.page) || 0

  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1
  }

  let perPage = Number(paginationRequest.perPage) || 0
  if (isNaN(perPage) || perPage < 1) {
    perPage = 50
  }

  const firstPosition = (pageNumber - 1) * perPage

  const whereCondition = paginationRequest.withDeleted ? {} : { deletedAt: null }

  return {
    firstPosition,
    perPage,
    whereCondition
  }
}
