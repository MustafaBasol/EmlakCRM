import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { Plus } from "lucide-react";
import { authOptions } from "@/lib/auth/auth-options";
import { getListings } from "@/lib/queries/listings/get-listings";
import { ListingTable } from "@/components/listings/listing-table";
import { ListingFilters } from "@/components/listings/listing-filters";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ListingStatus, PropertyType } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    type?: string;
  }>;
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const resolvedSearchParams = await searchParams;
  const user = session.user as any;

  const listings = await getListings({
    role: user.role,
    userId: user.id,
    search: resolvedSearchParams.search,
    status: resolvedSearchParams.status as ListingStatus,
    type: resolvedSearchParams.type as PropertyType,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">Portföyler</h1>
          <p className="text-[14px] text-[#475569]">
            Tüm gayrimenkul portföylerini yönetin ve filtreleyin.
          </p>
        </div>
        <Link href="/dashboard/properties/new" className={cn(buttonVariants(), "rounded-full px-5 font-bold shadow-md shadow-blue-900/10")}>
            <Plus className="mr-2 h-4 w-4" /> Yeni İlan Ekle
        </Link>
      </div>

      <div className="space-y-4">
        <ListingFilters />
        <ListingTable listings={listings} isAdmin={user.role === "ADMIN"} />
      </div>
    </div>
  );
}
