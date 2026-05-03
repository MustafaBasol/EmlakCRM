import { ActivityActionType, ActivityEntityType } from "@prisma/client";
import prisma from "@/lib/db/db";
import { ListingInput } from "@/lib/validations/listing";
import { logActivity } from "@/lib/services/activity/log-service";

export async function createListing(data: ListingInput, createdById: string, photoUrls: string[] = []) {
  try {
    const listing = await prisma.listing.create({
      data: {
        ...data,
        createdById,
        assignedAgentId: data.assignedAgentId || createdById,
        ...(photoUrls.length > 0 && {
          photos: {
            create: photoUrls.map((imageUrl, index) => ({
              imageUrl,
              sortOrder: index,
            })),
          },
        }),
      },
    });

    await logActivity({
      actorUserId: createdById,
      actionType: ActivityActionType.LISTING_CREATED,
      entityType: ActivityEntityType.LISTING,
      entityId: listing.id,
      summary: `Yeni portföy oluşturuldu: ${listing.title}`,
      metadataJson: { title: listing.title, price: listing.price, photoCount: photoUrls.length },
    });

    return listing;
  } catch (error) {
    console.error("Failed to create listing:", error);
    throw new Error("Portföy oluşturulamadı.");
  }
}

export async function updateListing(
  id: string,
  data: Partial<ListingInput>,
  actorUserId: string,
  photoUrls: string[] = []
) {
  try {
    const existingPhotoCount = await prisma.listingPhoto.count({
      where: { listingId: id },
    });

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        ...data,
        ...(Object.prototype.hasOwnProperty.call(data, "assignedAgentId") && {
          assignedAgentId: data.assignedAgentId || null,
        }),
        ...(photoUrls.length > 0 && {
          photos: {
            create: photoUrls.map((imageUrl, index) => ({
              imageUrl,
              sortOrder: existingPhotoCount + index,
            })),
          },
        }),
      },
    });

    await logActivity({
      actorUserId,
      actionType: ActivityActionType.LISTING_UPDATED,
      entityType: ActivityEntityType.LISTING,
      entityId: listing.id,
      summary: `Portföy güncellendi: ${listing.title}`,
      metadataJson: {
        changedFields: Object.keys(data),
        addedPhotoCount: photoUrls.length,
      },
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
      actionType: ActivityActionType.LISTING_UPDATED,
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
