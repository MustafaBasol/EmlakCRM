import { z } from "zod";
import { TaskStatus, TaskPriority } from "@prisma/client";

export const taskSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır."),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  assignedToId: z.string().min(1, "Lütfen bir danışman seçin."),
  listingId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
});

export type TaskInput = z.infer<typeof taskSchema>;
