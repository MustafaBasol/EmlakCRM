import { ActivityActionType, ActivityEntityType } from "@prisma/client";
import prisma from "@/lib/db/db";
import { CustomerInput } from "@/lib/validations/customer";
import { logActivity } from "@/lib/services/activity/log-service";

export async function createCustomer(data: CustomerInput, createdById: string) {
  try {
    const customer = await prisma.customer.create({
      data: {
        ...data,
        createdById,
        assignedAgentId: data.assignedAgentId || createdById,
      },
    });

    await logActivity({
      actorUserId: createdById,
      actionType: ActivityActionType.CUSTOMER_CREATED,
      entityType: ActivityEntityType.CUSTOMER,
      entityId: customer.id,
      summary: `Yeni müşteri kaydı oluşturuldu: ${customer.fullName}`,
      metadataJson: { fullName: customer.fullName, category: customer.category },
    });

    return customer;
  } catch (error) {
    console.error("Failed to create customer:", error);
    throw new Error("Müşteri kaydı oluşturulamadı.");
  }
}

export async function updateCustomer(id: string, data: Partial<CustomerInput>, actorUserId: string) {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data,
    });

    await logActivity({
      actorUserId,
      actionType: ActivityActionType.CUSTOMER_UPDATED,
      entityType: ActivityEntityType.CUSTOMER,
      entityId: customer.id,
      summary: `Müşteri kaydı güncellendi: ${customer.fullName}`,
      metadataJson: { changedFields: Object.keys(data) },
    });

    return customer;
  } catch (error) {
    console.error("Failed to update customer:", error);
    throw new Error("Müşteri kaydı güncellenemedi.");
  }
}

export async function deleteCustomer(id: string, actorUserId: string) {
  try {
    const customer = await prisma.customer.delete({
      where: { id },
    });

    await logActivity({
      actorUserId,
      actionType: ActivityActionType.CUSTOMER_UPDATED, // Reuse updated or add deleted to enum
      entityType: ActivityEntityType.CUSTOMER,
      entityId: customer.id,
      summary: `Müşteri kaydı silindi: ${customer.fullName}`,
    });

    return customer;
  } catch (error) {
    console.error("Failed to delete customer:", error);
    throw new Error("Müşteri kaydı silinemedi.");
  }
}
