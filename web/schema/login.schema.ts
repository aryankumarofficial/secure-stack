import { z } from "zod"

export const loginSchema = z.object({
  email: z.email({ error: "Invalid ID" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" }),
})

export type Login = z.infer<typeof loginSchema>;
