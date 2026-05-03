"use client";

import { useRouter } from "next/navigation";
import { User, Phone, Mail, Eye, Pencil, Trash2 } from "lucide-react";
import { CustomerCategory, CustomerStatus, PropertyType } from "@prisma/client";
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
import {
  customerCategoryLabels,
  customerStatusLabels,
  propertyTypeLabels,
} from "@/lib/constants/enum-labels";

interface CustomerTableProps {
  customers: any[];
  isAdmin: boolean;
}

const statusMap: Record<
  CustomerStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  NEW: { label: customerStatusLabels.NEW, variant: "default" },
  CONTACTED: { label: customerStatusLabels.CONTACTED, variant: "secondary" },
  FOLLOW_UP: { label: customerStatusLabels.FOLLOW_UP, variant: "outline" },
  VISIT_PLANNED: { label: customerStatusLabels.VISIT_PLANNED, variant: "secondary" },
  NEGOTIATION: { label: customerStatusLabels.NEGOTIATION, variant: "destructive" },
  CLOSED: { label: customerStatusLabels.CLOSED, variant: "outline" },
  LOST: { label: customerStatusLabels.LOST, variant: "outline" },
};

const categoryMap: Record<CustomerCategory, string> = {
  BUYER: customerCategoryLabels.BUYER,
  SELLER: customerCategoryLabels.SELLER,
  INVESTOR: customerCategoryLabels.INVESTOR,
  TENANT: customerCategoryLabels.TENANT,
  LANDLORD: customerCategoryLabels.LANDLORD,
  OTHER: customerCategoryLabels.OTHER,
};

function getBudgetText(customer: any) {
  if (customer.budgetMin && customer.budgetMax) {
    return `${formatCurrency(customer.budgetMin)} - ${formatCurrency(customer.budgetMax)}`;
  }

  if (customer.budgetMin) {
    return `${formatCurrency(customer.budgetMin)}+`;
  }

  if (customer.budgetMax) {
    return `0 - ${formatCurrency(customer.budgetMax)}`;
  }

  return "-";
}

export function CustomerTable({ customers, isAdmin }: CustomerTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
      <Table>
        <TableHeader className="bg-[#F8FAFC]">
          <TableRow className="border-b border-[#E2E8F0] hover:bg-transparent">
            <TableHead className="w-[280px] py-4 text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
              Müşteri
            </TableHead>
            <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
              İletişim
            </TableHead>
            <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
              Bütçe
            </TableHead>
            <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
              Durum
            </TableHead>
            {isAdmin && (
              <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
                Danışman
              </TableHead>
            )}
            <TableHead className="text-right text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
              Aksiyon
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isAdmin ? 6 : 5}
                className="h-24 text-center text-muted-foreground"
              >
                Müşteri bulunamadı.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow
                key={customer.id}
                className="cursor-pointer hover:bg-[#F8FAFC]"
                onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[16px] font-semibold text-[#0F172A]">
                        {customer.fullName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(customer.createdAt)}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-3.5 w-3.5" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-3.5 w-3.5" />
                      <span className="truncate">{customer.email || "-"}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#0F172A]">
                      {getBudgetText(customer)}
                    </span>
                    {customer.desiredPropertyType && (
                      <span className="text-xs text-muted-foreground">
                        Tercih: {propertyTypeLabels[customer.desiredPropertyType as PropertyType]}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col items-start gap-1.5">
                    <Badge variant="secondary">
                      {categoryMap[customer.category as CustomerCategory]}
                    </Badge>
                    <Badge variant={statusMap[customer.status as CustomerStatus].variant}>
                      {statusMap[customer.status as CustomerStatus].label}
                    </Badge>
                  </div>
                </TableCell>

                {isAdmin && (
                  <TableCell>
                    <div className="text-sm font-medium text-[#0F172A]">
                      {customer.assignedAgent?.fullName || "-"}
                    </div>
                  </TableCell>
                )}

                <TableCell className="text-right">
                  <TableRowActions
                    actions={[
                      {
                        label: "Görüntüle",
                        icon: Eye,
                        href: `/dashboard/customers/${customer.id}`,
                      },
                      {
                        label: "Düzenle",
                        icon: Pencil,
                        href: `/dashboard/customers/${customer.id}/edit`,
                      },
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
