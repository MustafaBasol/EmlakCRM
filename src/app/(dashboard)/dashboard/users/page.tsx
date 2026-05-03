import { Metadata } from "next";
import prisma from "@/lib/db/db";
import { UserCircle } from "lucide-react";
import Link from "next/link";
import { UsersTable } from "@/components/users/users-table";

export const metadata: Metadata = {
  title: "Danışmanlar | Emlak CRM",
};

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">Danışmanlar</h1>
          <p className="text-[14px] text-[#475569]">
            Sistemdeki tüm yönetici ve danışmanları listeleyin.
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

      <UsersTable users={users} />
    </div>
  );
}
