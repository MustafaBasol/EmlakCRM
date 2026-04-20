import { Metadata } from "next";
import prisma from "@/lib/db/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCircle, Pencil } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DanÄ±ÅŸmanlar | Emlak CRM",
};

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">DanÄ±ÅŸmanlar</h1>
          <p className="text-[14px] text-[#475569]">
            Sistemdeki tÃ¼m yÃ¶netici ve danÄ±ÅŸmanlarÄ± listeleyin.
          </p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1e40af]"
        >
          <UserCircle className="h-4 w-4" />
          Yeni Ekle
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
        <div className="border-b border-[#EEF2F7] px-6 py-4">
          <h3 className="font-semibold text-[#0F172A]">Ekip Listesi</h3>
        </div>
        <Table>
          <TableHeader className="bg-[#F8FAFC]">
            <TableRow className="border-b border-[#E2E8F0] hover:bg-transparent">
              <TableHead className="w-[300px] py-4 text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Ad Soyad</TableHead>
              <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">E-posta</TableHead>
              <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Rol</TableHead>
              <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Telefon</TableHead>
              <TableHead className="text-right text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Durum</TableHead>
              <TableHead className="text-right text-[13px] font-semibold uppercase tracking-wider text-[#475569]">Aksiyon</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-[#475569]">
                  DanÄ±ÅŸman bulunamadÄ±.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="transition-colors hover:bg-[#F8FAFC]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#1D4ED8]/20 bg-[#1D4ED8]/10 text-[#1D4ED8]">
                        {user.image ? (
                          <img src={user.image} alt={user.fullName} className="h-full w-full object-cover" />
                        ) : (
                          <UserCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#0F172A]">{user.fullName}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[14px] text-[#475569]">{user.email}</TableCell>
                  <TableCell>
                    {user.role === "ADMIN" ? (
                      <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[12px] font-bold text-[#1D4ED8]">YÃ–NETÄ°CÄ°</span>
                    ) : (
                      <span className="inline-flex items-center rounded-md border border-[#E2E8F0] bg-[#F1F5F9] px-2.5 py-0.5 text-[12px] font-bold text-[#475569]">DANIÅžMAN</span>
                    )}
                  </TableCell>
                  <TableCell className="text-[14px] text-[#475569]">{user.phone || "-"}</TableCell>
                  <TableCell className="text-right">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[12px] font-bold text-rose-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span> Pasif
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/users/${user.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-sm font-medium text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    >
                      <Pencil className="h-4 w-4" />
                      DÃ¼zenle
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
