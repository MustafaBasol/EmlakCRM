import { ListingStatus, PropertyType } from "@prisma/client";

export const propertyTypeLabels: Record<PropertyType, string> = {
  LAND: "Arsa",
  APARTMENT: "Daire",
  HOUSE: "Müstakil Ev",
  VILLA: "Villa",
  COMMERCIAL: "Ticari",
  OFFICE: "Ofis",
  SHOP: "Dükkan",
  FARM: "Çiftlik",
  OTHER: "Diğer",
};

export const listingStatusLabels: Record<ListingStatus, string> = {
  DRAFT: "Taslak",
  ACTIVE: "Aktif",
  RESERVED: "Rezerve",
  SOLD: "Satıldı",
  ARCHIVED: "Arşiv",
};
