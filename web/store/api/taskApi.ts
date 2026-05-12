import { baseApi } from "./baseApi"

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "/task",

      providesTags: ["Task"],
    }),

    createTask: builder.mutation({
      query: (body) => ({
        url: "/task",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Task"],
    }),

    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/task/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["Task"],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Task"],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi
