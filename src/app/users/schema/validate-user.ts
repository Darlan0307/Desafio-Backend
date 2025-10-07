import { z } from "zod"

export const UserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "O nome deve ter pelo menos 1 caractere")
      .max(100, "O nome não deve ter mais do que 100 caracteres"),
    email: z
      .email("O email não é válido")
      .max(255, "O email não deve ter mais do que 255 caracteres")
  })
  .strict()

export const UserPatchSchema = UserSchema.partial()
