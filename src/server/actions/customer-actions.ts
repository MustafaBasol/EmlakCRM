"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { createCustomer, updateCustomer, deleteCustomer } from "@/lib/services/customers/customer-service";
import { customerSchema, CustomerInput } from "@/lib/validations/customer";

export async function createCustomerAction(data: CustomerInput) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Oturum açmanız gerekiyor.");

  const validated = customerSchema.parse(data);
  const user = session.user as any;

  const customer = await createCustomer(validated, user.id);
  
  revalidatePath("/dashboard/customers");
  return customer;
}

export async function updateCustomerAction(id: string, data: Partial<CustomerInput>) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Oturum açmanız gerekiyor.");

  const user = session.user as any;
  const customer = await updateCustomer(id, data, user.id);
  
  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${id}`);
  return customer;
}

export async function deleteCustomerAction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Oturum açmanız gerekiyor.");

  const user = session.user as any;
  await deleteCustomer(id, user.id);
  
  revalidatePath("/dashboard/customers");
  return { success: true };
}
