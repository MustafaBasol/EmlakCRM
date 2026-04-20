import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { UserPlus } from "lucide-react";
import { authOptions } from "@/lib/auth/auth-options";
import { getCustomers } from "@/lib/queries/customers/get-customers";
import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerFilters } from "@/components/customers/customer-filters";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { CustomerCategory, CustomerStatus } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    category?: string;
  }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const resolvedSearchParams = await searchParams;
  const user = session.user as any;

  const customers = await getCustomers({
    role: user.role,
    userId: user.id,
    search: resolvedSearchParams.search,
    status: resolvedSearchParams.status as CustomerStatus,
    category: resolvedSearchParams.category as CustomerCategory,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">Müşteriler / CRM</h1>
          <p className="text-[14px] text-[#475569]">
            Tüm müşteri adaylarını ve mevcut müşterileri yönetin.
          </p>
        </div>
        <Link href="/dashboard/customers/new" className={cn(buttonVariants(), "rounded-full px-5 font-bold shadow-md shadow-blue-900/10")}>
            <UserPlus className="mr-2 h-4 w-4" /> Yeni Müşteri Ekle
        </Link>
      </div>

      <div className="space-y-4">
        <CustomerFilters />
        <CustomerTable customers={customers} isAdmin={user.role === "ADMIN"} />
      </div>
    </div>
  );
}
