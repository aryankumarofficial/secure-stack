import { baseApi } from "./baseApi"
import type { Task, CreateTaskDto, UpdateTaskDto } from "@/types/task.type"

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/task",

      providesTags: ["Task"],
    }),

    createTask: builder.mutation<Task, CreateTaskDto>({
      query: (body) => ({
        url: "/task",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Task"],
    }),

    updateTask: builder.mutation<Task, UpdateTaskDto>({
      query: ({ id, ...body }) => ({
        url: `/task/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["Task"],
    }),

    deleteTask: builder.mutation<void, string>({
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
