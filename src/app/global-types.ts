export type PaginationRequest = {
  page: number
  perPage: number
  withDeleted?: boolean
}

export type DataListResponse<T> = {
  data: T[]
  totalRecords: number
  totalPages: number
  perPage: number
  currentPage: number
}
