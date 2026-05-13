import { baseApi } from "./baseApi"

import { User } from "@/types/user"

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/admin/users",

      providesTags: ["Admin"],
    }),

    updateRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PATCH",
        body: {
          role,
        },
      }),

      invalidatesTags: ["Admin"],
    }),

    toggleBlock: builder.mutation({
      query: ({ userId, isBlocked }) => ({
        url: `/admin/users/${userId}/block`,
        method: "PATCH",
        body: {
          isBlocked,
        },
      }),

      invalidatesTags: ["Admin"],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useUpdateRoleMutation,
  useToggleBlockMutation,
} = adminApi