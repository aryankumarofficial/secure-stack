import * as z from "zod"

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { error: "Name Must be at least 3 character long" })
      .max(50, { error: "Name shouldn't exceed 50 characters" }),
    email: z.email({ error: "Invalid Email Address" }),
    password: z
      .string()
      .refine((value: string) => value.length > 8, {
        error: "Password must be at least 8 characters",
      })
      .refine((value: string) => value.length < 20, {
        error: "Password shouldn't exceed 20 characters",
      })
      .refine((value: string) => /[A-Z]/.test(value), {
        error: "Password must contain uppercase",
      })
      .refine((value) => /[a-z]/.test(value), {
        error: "Password must contain lower case",
      })
      .refine((value) => /\d/.test(value), {
        error: "Password must contain number",
      })
      .refine((value) => /[!@#$%^&*()_+=]/.test(value), {
        error: "Password must contain special characters",
      }),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>
