import type { AxiosError } from "axios"
export interface Pagination {
  limit: number,
  page: number
}
export interface ErrorResponse<Data> {
  error: Data
}
export type AxiosErrorResponse<T> = AxiosError<T>;
export type BackendErrorType = string | { message: string, path: string }[]
export interface ValidationErrorResponse {
  statusCode: 422
  message: {
    message: {
      message: string,
      path: string
    }[]
  },
}
export interface SuccessResponse<Data> {
  data: Data
  limit?: number,
  totalPages?: number
  totalItems?: number
}
// cú pháp `-?` sẽ loại bỏ undefiend của key optional

export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
