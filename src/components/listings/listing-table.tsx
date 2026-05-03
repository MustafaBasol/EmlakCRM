"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowActions } from "@/components/shared/table-row-actions";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { ListingStatus, PropertyType } from "@prisma/client";

interface ListingTableProps {
  listings: any[];
  isAdmin: boolean;
}

const statusMap: Record<ListingStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  DRAFT: { label: "Taslak", variant: "secondary" },
  ACTIVE: { label: "Aktif", variant: "default" },
  RESERVED: { label: "Rezerve", variant: "destructive" },
  SOLD: { label: "Satıldı", variant: "outline" },
  ARCHIVED: { label: "Arşiv", variant: "outline" },
};

const typeMap: Record<PropertyType, string> = {
  LAND: "Arsa",
  APARTMENT: "Daire",
  HOUSE: "Müstakil",
  VILLA: "Villa",
  COMMERCIAL: "Ticari",
  OFFICE: "Ofis",
  SHOP: "Dükkan",
  FARM: "Çiftlik",
  OTHER: "Diğer",
};

export function ListingTable({ listings, isAdmin }: ListingTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
      <Table>
        <TableHeader className="bg-[#F8FAFC]">
          <TableRow className="border-b border-[#E2E8F0] hover:bg-transparent">
            <TableHead className="w-[300px] py-4 text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Portföy</TableHead>
            <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Tip / Durum</TableHead>
            <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Konum</TableHead>
            <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Fiyat</TableHead>
            {isAdmin && <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Danışman</TableHead>}
            <TableHead className="text-right text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Aksiyon</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 5} className="h-24 text-center text-muted-foreground">
                Portföy bulunamadı.
              </TableCell>
            </TableRow>
          ) : (
            listings.map((listing) => (
              <TableRow
                key={listing.id}
                className="cursor-pointer hover:bg-[#F8FAFC]"
                onClick={() => router.push(`/dashboard/properties/${listing.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Building2 className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="max-w-[200px] truncate">{listing.title}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(listing.createdAt)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm">{typeMap[listing.propertyType as PropertyType]}</span>
                    <Badge variant={statusMap[listing.status as ListingStatus].variant}>
                      {statusMap[listing.status as ListingStatus].label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {listing.district}, {listing.city}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-slate-900">{formatCurrency(listing.price)}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="text-sm">{listing.assignedAgent?.fullName || "-"}</div>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <TableRowActions
                    actions={[
                      { label: "Görüntüle", icon: Eye, href: `/dashboard/properties/${listing.id}` },
                      { label: "Düzenle", icon: Pencil, href: `/dashboard/properties/${listing.id}/edit` },
                      { label: "Sil", icon: Trash2, isDestructive: true },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
