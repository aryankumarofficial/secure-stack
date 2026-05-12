import { logout, setCredentials } from "@/features/auth/authSlice"
import { baseApi } from "./baseApi"
import type { User } from "@/types/user.type"
interface LoginBody {
  email: string
  password: string
}

interface RegisterBody {
  name: string
  email: string
  password: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body: LoginBody) => ({
        url: "/user/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation({
      query: (body: RegisterBody) => ({
        url: "/user/register",
        method: "POST",
        body,
      }),
    }),

    me: builder.query<User, void>({
      query: () => "/user/me",

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch {
          dispatch(logout())
        }
      },

      providesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi
