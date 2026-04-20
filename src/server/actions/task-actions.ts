"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { createTask, updateTask, deleteTask } from "@/lib/services/tasks/task-service";
import { taskSchema, TaskInput } from "@/lib/validations/task";

export async function createTaskAction(data: TaskInput) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Oturum açmanız gerekiyor.");

  const validated = taskSchema.parse(data);
  const user = session.user as any;

  const task = await createTask(validated, user.id);
  
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard"); // Dashboard home has task list
  return task;
}

export async function updateTaskAction(id: string, data: Partial<TaskInput>) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Oturum açmanız gerekiyor.");

  const user = session.user as any;
  const task = await updateTask(id, data, user.id);
  
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
  return task;
}

export async function toggleTaskStatusAction(id: string, currentStatus: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Oturum açmanız gerekiyor.");

  const newStatus = currentStatus === "DONE" ? "TODO" : "DONE";
  const user = session.user as any;
  
  const task = await updateTask(id, { status: newStatus as any }, user.id);
  
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
  return task;
}

export async function deleteTaskAction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Oturum açmanız gerekiyor.");

  const user = session.user as any;
  await deleteTask(id, user.id);
  
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
  return { success: true };
}
