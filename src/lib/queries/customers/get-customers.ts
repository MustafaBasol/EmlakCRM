import { CustomerCategory, CustomerStatus, UserRole } from "@prisma/client";
import prisma from "@/lib/db/db";

export interface GetCustomersParams {
  role: UserRole;
  userId: string;
  status?: CustomerStatus;
  category?: CustomerCategory;
  search?: string;
}

export async function getCustomers({
  role,
  userId,
  status,
  category,
  search,
}: GetCustomersParams) {
  const where: any = {};

  // Role-based scoping
  if (role === UserRole.AGENT) {
    where.assignedAgentId = userId;
  }

  // Filters
  if (status) {
    where.status = status;
  }
  if (category) {
    where.category = category;
  }
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        assignedAgent: {
          select: { fullName: true },
        },
      },
    });

    return customers.map(customer => ({
      ...customer,
      budgetMin: customer.budgetMin?.toNumber() || null,
      budgetMax: customer.budgetMax?.toNumber() || null,
    }));
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    throw new Error("Müşteriler yüklenemedi.");
  }
}

export async function getCustomerById(id: string, role: UserRole, userId: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        assignedAgent: {
          select: { fullName: true, phone: true },
        },
        createdBy: {
          select: { fullName: true },
        },
        tasks: {
          orderBy: { dueDate: "asc" },
        },
      },
    });

    if (!customer) return null;

    // Authorization check
    if (role === UserRole.AGENT && customer.assignedAgentId !== userId) {
      throw new Error("Bu kaydı görmeye yetkiniz yok.");
    }

    return {
      ...customer,
      budgetMin: customer.budgetMin?.toNumber() || null,
      budgetMax: customer.budgetMax?.toNumber() || null,
    };
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    throw new Error("Müşteri detayı yüklenemedi.");
  }
}
