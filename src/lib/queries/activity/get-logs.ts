import prisma from "@/lib/db/db";

export async function getActivities(page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          actor: { select: { fullName: true, role: true } },
        },
      }),
      prisma.activityLog.count(),
    ]);

    return {
      logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    throw new Error("Aktivite kayıtları yüklenemedi.");
  }
}
