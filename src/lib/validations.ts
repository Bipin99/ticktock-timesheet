import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const entrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  projectId: z.string().min(1, "Select a project"),
  workType: z.string().min(1, "Select a type of work"),
  description: z.string().min(1, "Task description is required"),
  hours: z.coerce
    .number()
    .int("Hours must be a whole number")
    .min(1, "Hours must be at least 1")
    .max(24, "Hours cannot exceed 24"),
});

export type EntryInput = z.infer<typeof entrySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
