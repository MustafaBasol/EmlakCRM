import { TaskStatus, TaskPriority, UserRole } from "@prisma/client";
import prisma from "@/lib/db/db";

export interface GetTasksParams {
  role: UserRole;
  userId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  customerId?: string;
  listingId?: string;
}

export async function getTasks({
  role,
  userId,
  status,
  priority,
  search,
  customerId,
  listingId,
}: GetTasksParams) {
  const where: any = {};

  // Role-based scoping
  if (role === UserRole.AGENT) {
    where.assignedToId = userId;
  }

  // Filters
  if (status) {
    where.status = status;
  }
  if (priority) {
    where.priority = priority;
  }
  if (customerId) {
    where.customerId = customerId;
  }
  if (listingId) {
    where.listingId = listingId;
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const tasks = await prisma.task.findMany({
      where,
      orderBy: [
        { status: "asc" }, // TODO first
        { dueDate: "asc" },
      ],
      include: {
        assignedTo: {
          select: { fullName: true },
        },
        customer: {
          select: { fullName: true },
        },
        listing: {
          select: { title: true },
        },
      },
    });

    return tasks;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw new Error("Görevler yüklenemedi.");
  }
}

export async function getTaskById(id: string, role: UserRole, userId: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { fullName: true } },
        customer: { select: { fullName: true } },
        listing: { select: { title: true } },
        createdBy: { select: { fullName: true } },
      },
    });

    if (!task) return null;

    // Authorization check
    if (role === UserRole.AGENT && task.assignedToId !== userId) {
      throw new Error("Bu kaydı görmeye yetkiniz yok.");
    }

    return task;
  } catch (error) {
    console.error("Failed to fetch task:", error);
    throw new Error("Görev detayı yüklenemedi.");
  }
}
