import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"

import { logout } from "@/features/auth/authSlice"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://secure-stack-backend.aryankumarofficial.dev/api"

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
})

let refreshPromise: Promise<any> | null = null

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  /*
  |--------------------------------------------------------------------------
  | Access token expired
  |--------------------------------------------------------------------------
  */

  if (result.error?.status === 401) {
    try {
      /*
      |--------------------------------------------------------------------------
      | Prevent multiple refresh calls
      |--------------------------------------------------------------------------
      */

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            return await rawBaseQuery(
              {
                url: "/user/refresh",
                method: "POST",
              },
              api,
              extraOptions
            )
          } finally {
            refreshPromise = null
          }
        })()
      }

      const refreshResult = await refreshPromise

      /*
      |--------------------------------------------------------------------------
      | Refresh failed
      |--------------------------------------------------------------------------
      */

      if (refreshResult.error) {
        api.dispatch(logout())

        return result
      }

      /*
      |--------------------------------------------------------------------------
      | Retry original request
      |--------------------------------------------------------------------------
      */

      result = await rawBaseQuery(args, api, extraOptions)
    } catch {
      api.dispatch(logout())
    }
  }

  return result
}
