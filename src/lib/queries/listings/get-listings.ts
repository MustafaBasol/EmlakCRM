import { ListingStatus, PropertyType, UserRole } from "@prisma/client";
import prisma from "@/lib/db/db";

export interface GetListingsParams {
  role: UserRole;
  userId: string;
  status?: ListingStatus;
  type?: PropertyType;
  search?: string;
}

export async function getListings({
  role,
  userId,
  status,
  type,
  search,
}: GetListingsParams) {
  const where: any = {};

  // Role-based scoping
  if (role === UserRole.AGENT) {
    where.assignedAgentId = userId;
  }

  // Filters
  if (status) {
    where.status = status;
  }
  if (type) {
    where.propertyType = type;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { district: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        assignedAgent: {
          select: { fullName: true },
        },
      },
    });

    return listings.map(listing => ({
      ...listing,
      price: listing.price.toNumber(),
      areaSizeM2: listing.areaSizeM2?.toNumber() || null,
    }));
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    throw new Error("Portföyler yüklenemedi.");
  }
}

export async function getListingById(id: string, role: UserRole, userId: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        assignedAgent: {
          select: { fullName: true, phone: true },
        },
        createdBy: {
          select: { fullName: true },
        },
        photos: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!listing) return null;

    // Authorization check
    if (role === UserRole.AGENT && listing.assignedAgentId !== userId) {
      throw new Error("Bu kaydı görmeye yetkiniz yok.");
    }

    return {
      ...listing,
      price: listing.price.toNumber(),
      areaSizeM2: listing.areaSizeM2?.toNumber() || null,
    };
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    throw new Error("Portföy detayı yüklenemedi.");
  }
}
