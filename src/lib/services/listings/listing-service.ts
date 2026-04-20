import { ActivityActionType, ActivityEntityType } from "@prisma/client";
import prisma from "@/lib/db/db";
import { ListingInput } from "@/lib/validations/listing";
import { logActivity } from "@/lib/services/activity/log-service";

export async function createListing(data: ListingInput, createdById: string) {
  try {
    const listing = await prisma.listing.create({
      data: {
        ...data,
        createdById,
        // If no assigned agent, default to creator
        assignedAgentId: data.assignedAgentId || createdById,
      },
    });

    await logActivity({
      actorUserId: createdById,
      actionType: ActivityActionType.LISTING_CREATED,
      entityType: ActivityEntityType.LISTING,
      entityId: listing.id,
      summary: `Yeni portföy oluşturuldu: ${listing.title}`,
      metadataJson: { title: listing.title, price: listing.price },
    });

    return listing;
  } catch (error) {
    console.error("Failed to create listing:", error);
    throw new Error("Portföy oluşturulamadı.");
  }
}

export async function updateListing(id: string, data: Partial<ListingInput>, actorUserId: string) {
  try {
    const listing = await prisma.listing.update({
      where: { id },
      data,
    });

    await logActivity({
      actorUserId,
      actionType: ActivityActionType.LISTING_UPDATED,
      entityType: ActivityEntityType.LISTING,
      entityId: listing.id,
      summary: `Portföy güncellendi: ${listing.title}`,
      metadataJson: { changedFields: Object.keys(data) },
    });

    return listing;
  } catch (error) {
    console.error("Failed to update listing:", error);
    throw new Error("Portföy güncellenemedi.");
  }
}

export async function deleteListing(id: string, actorUserId: string) {
  try {
    const listing = await prisma.listing.delete({
      where: { id },
    });

    await logActivity({
      actorUserId,
      actionType: ActivityActionType.LISTING_UPDATED, // We could add LISTING_DELETED to enum if needed
      entityType: ActivityEntityType.LISTING,
      entityId: listing.id,
      summary: `Portföy silindi: ${listing.title}`,
    });

    return listing;
  } catch (error) {
    console.error("Failed to delete listing:", error);
    throw new Error("Portföy silinemedi.");
  }
}
