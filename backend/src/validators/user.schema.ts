import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, { error: `Name is Required` }),
  email: z.email({ error: "Invalid Email Id" }),
  password: z
    .string()
    .min(8, { error: "Password must be atleast 8 characters" })
    .max(20, { error: "Password must be smaller than 8 characters" })
    .refine((v) => /[A-Z]/.test(v), { error: "Must contain Upper case" })
    .refine((v) => /[a-z]/.test(v), { error: "Must contain lower case" })
    .refine((v) => /\d/.test(v), { error: "Must contain number" })
    .refine((v) => /[!@#$%^&*]/.test(v), {
      error: "Must contain specail characters",
    }),
});

export type User = z.infer<typeof userSchema>;

export const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export type Login = z.infer<typeof loginSchema>;
