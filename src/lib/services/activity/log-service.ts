import { ActivityActionType, ActivityEntityType } from "@prisma/client";
import prisma from "@/lib/db/db";

export interface LogActivityParams {
  actorUserId: string;
  actionType: ActivityActionType;
  entityType: ActivityEntityType;
  entityId?: string;
  summary: string;
  metadataJson?: any;
}

export async function logActivity({
  actorUserId,
  actionType,
  entityType,
  entityId,
  summary,
  metadataJson,
}: LogActivityParams) {
  try {
    const log = await prisma.activityLog.create({
      data: {
        actorUserId,
        actionType,
        entityType,
        entityId,
        summary,
        metadataJson,
      },
    });
    return log;
  } catch (error) {
    console.error("Failed to log activity:", error);
    // We don't want to break the main flow if logging fails
    return null;
  }
}
