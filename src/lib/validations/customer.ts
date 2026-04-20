import { z } from "zod";
import { CustomerCategory, CustomerStatus, PropertyType } from "@prisma/client";

export const customerSchema = z.object({
  fullName: z.string().min(3, "Ad Soyad en az 3 karakter olmalıdır."),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin."),
  email: z.string().email("Geçerli bir e-posta adresi girin.").optional().or(z.literal("")),
  category: z.nativeEnum(CustomerCategory).default(CustomerCategory.BUYER),
  desiredPropertyType: z.nativeEnum(PropertyType).optional(),
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
  preferredCity: z.string().optional(),
  preferredDistrict: z.string().optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(CustomerStatus).default(CustomerStatus.NEW),
  assignedAgentId: z.string().optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
