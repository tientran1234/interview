
import type { AxiosErrorResponse, BackendErrorType, ErrorResponse } from '@/types/utils.type'
import axios, { AxiosError, HttpStatusCode } from 'axios'
export function isAxiosError<T>(error: unknown): error is AxiosErrorResponse<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosErrorResponse<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}
export function isAxiosForbiddenError<ForbiddenError>(error: unknown): error is AxiosError<ForbiddenError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Forbidden
}


export function isAxiosExpiredTokenError<UnauthorizedError>(error: AxiosErrorResponse<ErrorResponse<UnauthorizedError>>): error is AxiosErrorResponse<ErrorResponse<UnauthorizedError>> {

  return (
    isAxiosUnauthorizedError<ErrorResponse<string>>(error) &&
    error.response?.data?.error === 'Error.InvalidAccessToken'
  )
}


export function buildQueryURL(
  baseUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>): string {
  if (!params) return baseUrl;

  const queryString = Object.entries(params)
    .flatMap(([key, value]) => {
      if (value === undefined || value === null || value === "" || value === 0) return [];


      if (Array.isArray(value)) {
        return value.map(
          (v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
        );
      }


      if (typeof value === "boolean") {
        return `${encodeURIComponent(key)}=${value ? "true" : "false"}`;
      }


      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}


export function convertResponseMessage(
  error: unknown
) {

  if (isAxiosError<ErrorResponse<BackendErrorType>>(error)) return (error.response!.data.error)
}





export const formatVND = (price: number) =>
  Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
