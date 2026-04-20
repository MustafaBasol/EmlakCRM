"use client";

import Link from "next/link";
import { 
  User, 
  Phone, 
  Mail, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CalendarPlus } from "lucide-react";
import { TableRowActions } from "@/components/shared/table-row-actions";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { CustomerCategory, CustomerStatus } from "@prisma/client";
import { formatDate } from "@/lib/utils/format";

interface CustomerTableProps {
  customers: any[];
  isAdmin: boolean;
}

const statusMap: Record<CustomerStatus, { label: string; variant: any }> = {
  NEW: { label: "Yeni", variant: "default" },
  CONTACTED: { label: "İletişim Kuruldu", variant: "secondary" },
  FOLLOW_UP: { label: "Takipte", variant: "outline" },
  VISIT_PLANNED: { label: "Yer Gösterme", variant: "secondary" },
  NEGOTIATION: { label: "Teklif/Pazarlık", variant: "destructive" },
  CLOSED: { label: "Satış/Kiralama", variant: "outline" },
  LOST: { label: "Kaybedildi", variant: "outline" },
};

const categoryMap: Record<CustomerCategory, string> = {
  BUYER: "Alıcı",
  SELLER: "Satıcı",
  INVESTOR: "Yatırımcı",
  TENANT: "Kiracı",
  LANDLORD: "Mülk Sahibi",
  OTHER: "Diğer",
};

export function CustomerTable({ customers, isAdmin }: CustomerTableProps) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-card overflow-hidden">
      <Table>
        <TableHeader className="bg-[#F8FAFC]">
          <TableRow className="hover:bg-transparent border-b border-[#E2E8F0]">
            <TableHead className="w-[300px] text-[13px] font-semibold text-[#475569] uppercase tracking-wider py-4">Müşteri</TableHead>
            <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">İletişim</TableHead>
            <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Bütçe</TableHead>
            <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Durum</TableHead>
            {isAdmin && <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Danışman</TableHead>}
            <TableHead className="text-right text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Aksiyon</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 5} className="h-24 text-center text-muted-foreground">
                Müşteri bulunamadı.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 shrink-0">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="truncate max-w-[180px]">{customer.fullName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(customer.createdAt)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-sm">{categoryMap[customer.category as CustomerCategory]}</span>
                    <Badge variant={statusMap[customer.status as CustomerStatus].variant}>
                      {statusMap[customer.status as CustomerStatus].label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-3.5 w-3.5" />
                      {customer.phone}
                    </div>
                    {customer.email && (
                      <div className="flex items-center">
                        <Mail className="mr-2 h-3.5 w-3.5" />
                        <span className="truncate max-w-[150px]">{customer.email}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="text-sm">{customer.assignedAgent?.fullName || "-"}</div>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <TableRowActions 
                    actions={[
                      { label: "Görüntüle", icon: Eye, href: `/dashboard/customers/${customer.id}` },
                      { label: "Düzenle", icon: Pencil, href: `/dashboard/customers/${customer.id}/edit` },
                      { label: "Sil", icon: Trash2, isDestructive: true }
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
