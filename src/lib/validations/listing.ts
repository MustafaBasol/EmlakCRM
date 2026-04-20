import { z } from "zod";
import { ListingStatus, PropertyType } from "@prisma/client";

export const listingSchema = z.object({
  title: z.string().min(5, "BaÅŸlÄ±k en az 5 karakter olmalÄ±dÄ±r."),
  description: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType, {
    error: "LÃ¼tfen bir mÃ¼lk tipi seÃ§in.",
  }),
  status: z.nativeEnum(ListingStatus).default(ListingStatus.DRAFT),
  price: z.coerce.number().min(0, "Fiyat negatif olamaz."),
  areaSizeM2: z.coerce.number().min(0, "mÂ² negatif olamaz.").optional(),
  roomCount: z.coerce.number().int().min(0).optional(),
  bathroomCount: z.coerce.number().int().min(0).optional(),
  buildingAge: z.coerce.number().int().min(0).optional(),

  // Location
  city: z.string().optional(),
  district: z.string().optional(),
  neighborhood: z.string().optional(),
  addressText: z.string().optional(),
  islandNo: z.string().optional(),
  parcelNo: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),

  assignedAgentId: z.string().optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;
