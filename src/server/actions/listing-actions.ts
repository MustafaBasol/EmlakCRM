"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { createListing, updateListing, deleteListing } from "@/lib/services/listings/listing-service";
import { listingSchema } from "@/lib/validations/listing";
import { uploadFile } from "@/lib/utils/upload";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getOptionalNumberValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  return value;
}

function parseListingFormData(formData: FormData) {
  return listingSchema.parse({
    title: getStringValue(formData, "title"),
    description: getStringValue(formData, "description"),
    propertyType: getStringValue(formData, "propertyType"),
    status: getStringValue(formData, "status"),
    price: getStringValue(formData, "price"),
    areaSizeM2: getOptionalNumberValue(formData, "areaSizeM2"),
    roomCount: getOptionalNumberValue(formData, "roomCount"),
    bathroomCount: getOptionalNumberValue(formData, "bathroomCount"),
    buildingAge: getOptionalNumberValue(formData, "buildingAge"),
    city: getStringValue(formData, "city"),
    district: getStringValue(formData, "district"),
    neighborhood: getStringValue(formData, "neighborhood"),
    addressText: getStringValue(formData, "addressText"),
    islandNo: getStringValue(formData, "islandNo"),
    parcelNo: getStringValue(formData, "parcelNo"),
    latitude: getOptionalNumberValue(formData, "latitude"),
    longitude: getOptionalNumberValue(formData, "longitude"),
    assignedAgentId: getStringValue(formData, "assignedAgentId"),
  });
}

async function uploadListingPhotos(formData: FormData) {
  const files = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0 && value.name !== "undefined");

  const uploaded = await Promise.all(files.map((file) => uploadFile(file, "listings")));
  return uploaded.filter((value): value is string => Boolean(value));
}

export async function createListingAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Oturum açmanız gerekiyor.");

  const user = session.user as any;
  const validated = parseListingFormData(formData);
  const photoUrls = await uploadListingPhotos(formData);

  const listing = await createListing(validated, user.id, photoUrls);

  revalidatePath("/dashboard/properties");
  return { success: true, id: listing.id };
}

export async function updateListingAction(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Oturum açmanız gerekiyor.");

  const user = session.user as any;
  const validated = parseListingFormData(formData);
  const photoUrls = await uploadListingPhotos(formData);

  const listing = await updateListing(id, validated, user.id, photoUrls);

  revalidatePath("/dashboard/properties");
  revalidatePath(`/dashboard/properties/${id}`);
  return { success: true, id: listing.id };
}

export async function deleteListingAction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Oturum açmanız gerekiyor.");

  const user = session.user as any;
  await deleteListing(id, user.id);

  revalidatePath("/dashboard/properties");
  return { success: true };
}
