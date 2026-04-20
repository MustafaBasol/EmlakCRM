import * as z from "zod";
import { UserRole } from "@prisma/client";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const userSchema = z.object({
  fullName: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().optional().nullable(),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean().default(true),
  image: z.any().optional(), // For file uploads
});

export const userCreateSchema = userSchema.extend({
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export type UserInput = z.infer<typeof userSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
