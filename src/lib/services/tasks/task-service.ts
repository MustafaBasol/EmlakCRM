import { ActivityActionType, ActivityEntityType } from "@prisma/client";
import prisma from "@/lib/db/db";
import { TaskInput } from "@/lib/validations/task";
import { logActivity } from "@/lib/services/activity/log-service";

export async function createTask(data: TaskInput, createdById: string) {
  try {
    const task = await prisma.task.create({
      data: {
        ...data,
        createdById,
      },
    });

    await logActivity({
      actorUserId: createdById,
      actionType: ActivityActionType.TASK_CREATED,
      entityType: ActivityEntityType.TASK,
      entityId: task.id,
      summary: `Yeni görev oluşturuldu: ${task.title}`,
      metadataJson: { title: task.title, priority: task.priority },
    });

    return task;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw new Error("Görev oluşturulamadı.");
  }
}

export async function updateTask(id: string, data: Partial<TaskInput>, actorUserId: string) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data,
    });

    await logActivity({
      actorUserId,
      actionType: ActivityActionType.TASK_UPDATED,
      entityType: ActivityEntityType.TASK,
      entityId: task.id,
      summary: `Görev güncellendi: ${task.title}`,
      metadataJson: { changedFields: Object.keys(data) },
    });

    return task;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw new Error("Görev güncellenemedi.");
  }
}

export async function deleteTask(id: string, actorUserId: string) {
  try {
    const task = await prisma.task.delete({
      where: { id },
    });

    await logActivity({
      actorUserId,
      actionType: ActivityActionType.TASK_UPDATED, 
      entityType: ActivityEntityType.TASK,
      entityId: task.id,
      summary: `Görev silindi: ${task.title}`,
    });

    return task;
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw new Error("Görev silinemedi.");
  }
}
