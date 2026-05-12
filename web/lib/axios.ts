import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://secure-stack-backend.aryankumarofficial.dev/api"

interface ApiErrorResponse {
  success: boolean
  message: string
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

/*
|--------------------------------------------------------------------------
| Main API Client
|--------------------------------------------------------------------------
*/

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

/*
|--------------------------------------------------------------------------
| Refresh Client
| Separate instance prevents interceptor recursion
|--------------------------------------------------------------------------
*/

const refreshClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

/*
|--------------------------------------------------------------------------
| Logout Handler
|--------------------------------------------------------------------------
*/

type LogoutHandler = () => void

let logoutHandler: LogoutHandler | null = null

export function registerLogoutHandler(handler: LogoutHandler) {
  logoutHandler = handler
}

function triggerLogout() {
  logoutHandler?.()
}

/*
|--------------------------------------------------------------------------
| Refresh Token Rotation Queue
|--------------------------------------------------------------------------
|
| Prevents multiple refresh calls during token expiration.
| All failed requests wait for a single refresh operation.
|--------------------------------------------------------------------------
*/

let refreshPromise: Promise<void> | null = null

async function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/user/refresh")
      .then(() => {})
      .catch((error) => {
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ApiErrorResponse>) => {
    /*
    |--------------------------------------------------------------------------
    | Network Error
    |--------------------------------------------------------------------------
    */

    if (!error.response) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryRequestConfig

    /*
    |--------------------------------------------------------------------------
    | Only handle 401
    |--------------------------------------------------------------------------
    */

    if (error.response.status !== 401) {
      return Promise.reject(error)
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent infinite refresh loops
    |--------------------------------------------------------------------------
    */

    if (
      originalRequest.url?.includes("/user/refresh") ||
      originalRequest._retry
    ) {
      triggerLogout()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      /*
      |--------------------------------------------------------------------------
      | Refresh Token Rotation
      |--------------------------------------------------------------------------
      */

      await refreshAccessToken()

      /*
      |--------------------------------------------------------------------------
      | Retry Original Request
      |--------------------------------------------------------------------------
      */

      return api(originalRequest)
    } catch (refreshError) {
      /*
      |--------------------------------------------------------------------------
      | Refresh Failed
      |--------------------------------------------------------------------------
      */

      triggerLogout()

      return Promise.reject(refreshError)
    }
  }
)

export default api
