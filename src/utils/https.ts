
import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios'
import { clearLS, getAccessTokenFromLS, getRefreshTokenFromLS, setAccessTokenToLS, setRefreshTokenToLS } from './auth';
import config from '@/constants/config';
import { PRIVATE_ROUTES } from '@/constants/path';
import { convertResponseMessage, isAxiosError, isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils';
import { useAppStore } from '@/contexts/app.context';
import type { BackendErrorType, ErrorResponse } from '@/types/utils.type';
import { AUTH } from '@/apis/auth.api';

const addNotification = useAppStore.getState().addNotification;
const retryableStatuses: number[] = [
  HttpStatusCode.UnprocessableEntity,
  HttpStatusCode.Unauthorized
]

export class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    this.instance.interceptors.request.use(
      (config) => {



        if (!this.accessToken && getAccessTokenFromLS()) {
          this.accessToken = getAccessTokenFromLS()
          config.headers.Authorization = this.accessToken
        }
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken

          return config
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config

        if (url === AUTH.LOGOUT) {

          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
          addNotification({
            type: "success",
            message: "Đăng xuất thành công",
            duration: 3000,
          });
        }

        return response
      },
      (error: AxiosError) => {


        if (
          !retryableStatuses.includes(error.response?.status as number)
        ) {

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message


          addNotification({
            type: "error",

            message,
            duration: 5000,
          });
        }

        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {


          const config = error.response?.config || { headers: {}, url: '' }


          const { url } = config

          if (isAxiosExpiredTokenError(error) && url !== PRIVATE_ROUTES.refreshToken) {

            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                setTimeout(() => {
                  this.refreshTokenRequest = null
                }, 10000)
              })

            return this.refreshTokenRequest.then((accessToken) => {

              return this.instance({ ...config, headers: { ...config.headers, authorization: accessToken } })
            })
          }
          clearLS()
          this.accessToken = ''
          this.refreshToken = ''



        }
        if (isAxiosError<ErrorResponse<BackendErrorType>>(error)) {
          const errorBackend = convertResponseMessage(error)
          if (errorBackend && errorBackend?.length > 0) {

            (errorBackend as {
              message: string;
              path: string;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }[]).map((item: any) => {
              addNotification({
                type: "error",
                message: item.message,
                duration: 5000,
              });
            })

          } else {
            addNotification({
              type: "error",
              message: errorBackend as string,
              duration: 5000,
            });

          }

        }
        return Promise.reject(error)

      }
    )
  }
  private handleRefreshToken() {


    return this.instance
      .post(PRIVATE_ROUTES.refreshToken, {
        refreshToken: this.refreshToken
      })
      .then((res) => {


        const { accessToken, refreshToken } = res.data

        setRefreshTokenToLS(refreshToken)
        setAccessTokenToLS(accessToken)
        this.accessToken = accessToken
        this.refreshToken = refreshToken

        return accessToken
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}
const http = new Http().instance

export const httpInstance = new Http()
export default http
