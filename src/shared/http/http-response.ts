/* eslint-disable @typescript-eslint/no-explicit-any */

export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  headers?: any
  params?: any
  query?: any
  body?: any
}
