"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db/db";
import bcrypt from "bcryptjs";
import { uploadFile } from "@/lib/utils/upload";
import { userCreateSchema, userSchema } from "@/lib/validations/user";

export async function createUserAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Yetkilendirme hatası");
  }

  // Parse fields
  const data = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string | null,
    role: formData.get("role") as any,
    isActive: formData.get("isActive") === "true",
    password: formData.get("password") as string,
  };

  const validated = userCreateSchema.parse(data);

  // Check email exists
  const existingUser = await prisma.user.findUnique({ where: { email: validated.email } });
  if (existingUser) {
    throw new Error("Bu e-posta adresi zaten kullanılıyor.");
  }

  // Handle Image Upload
  let imageUrl = null;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
    imageUrl = await uploadFile(imageFile, "avatars");
  }

  const hashedPassword = await bcrypt.hash(validated.password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: validated.fullName,
      email: validated.email,
      phone: validated.phone,
      role: validated.role,
      isActive: validated.isActive,
      passwordHash: hashedPassword,
      image: imageUrl,
    },
  });

  revalidatePath("/dashboard/users");
  return user;
}

export async function updateUserAction(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Yetkilendirme hatası");
  }

  const data = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string | null,
    role: formData.get("role") as any,
    isActive: formData.get("isActive") === "true",
  };

  const validated = userSchema.parse(data);

  // Check email
  const existingUser = await prisma.user.findUnique({ where: { email: validated.email } });
  if (existingUser && existingUser.id !== id) {
    throw new Error("Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.");
  }

  // Handle Image Upload
  const imageFile = formData.get("image") as File | null;
  let imageUrl: string | undefined = undefined;
  
  if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
    const uploadedUrl = await uploadFile(imageFile, "avatars");
    if (uploadedUrl) imageUrl = uploadedUrl;
  }

  // Handle Password optionally
  let passwordHash: string | undefined = undefined;
  const password = formData.get("password") as string | null;
  if (password && password.length >= 6) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  const updateData: any = {
    fullName: validated.fullName,
    email: validated.email,
    phone: validated.phone,
    role: validated.role,
    isActive: validated.isActive,
  };

  if (imageUrl !== undefined) updateData.image = imageUrl;
  if (passwordHash !== undefined) updateData.passwordHash = passwordHash;

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/dashboard/users");
  return user;
}

export async function deleteUserAction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Yetkilendirme hatası");
  }

  // Important: Check if trying to delete self
  if ((session.user as any).id === id) {
    throw new Error("Kendinizi silemezsiniz.");
  }

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/dashboard/users");
  return { success: true };
}
