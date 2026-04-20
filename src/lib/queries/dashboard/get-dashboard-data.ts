import prisma from "@/lib/db/db";
import { UserRole, TaskStatus } from "@prisma/client";

export async function getDashboardStats(role: UserRole, userId: string) {
  const isAgent = role === UserRole.AGENT;

  // Active Listings Count
  const activeListingsCount = await prisma.listing.count({
    where: {
      status: "ACTIVE",
      ...(isAgent ? { assignedAgentId: userId } : {}),
    },
  });

  // Total Customers Count
  const totalCustomersCount = await prisma.customer.count({
    where: {
      ...(isAgent ? { assignedAgentId: userId } : {}),
    },
  });

  // Pending Tasks Count
  const pendingTasksCount = await prisma.task.count({
    where: {
      status: "TODO",
      assignedToId: userId,
    },
  });

  // Fetch Upcoming Tasks (Limit to 5)
  const upcomingTasks = await prisma.task.findMany({
    where: {
      status: "TODO",
      assignedToId: userId,
    },
    orderBy: { dueDate: "asc" },
    take: 5,
    include: {
      customer: { select: { fullName: true } },
      listing: { select: { title: true } },
    },
  });

  // Fetch Recent Activity Logs (Limit to 10)
  const recentLogs = await prisma.activityLog.findMany({
    where: isAgent ? { actorUserId: userId } : {},
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      actor: { select: { fullName: true } },
    },
  });

  return {
    stats: {
      activeListings: activeListingsCount,
      totalCustomers: totalCustomersCount,
      pendingTasks: pendingTasksCount,
      // We can add more stats like "Closed sales this month" later
    },
    upcomingTasks,
    recentLogs,
  };
}
