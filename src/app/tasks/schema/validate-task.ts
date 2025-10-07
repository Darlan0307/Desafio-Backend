import { z } from "zod"

export const TaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "O título deve ter pelo menos 1 caractere")
      .max(100, "O título não deve ter mais do que 100 caracteres"),
    description: z
      .string()
      .trim()
      .min(1, "A descrição deve ter pelo menos 1 caractere")
      .max(255, "A descrição não deve ter mais do que 255 caracteres"),
    userId: z.string()
  })
  .strict()

export const TaskPatchSchema = TaskSchema.partial().extend({
  status: z.enum(["pending", "completed"])
})
