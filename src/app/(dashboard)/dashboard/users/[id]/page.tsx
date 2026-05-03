import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db/db";
import { Mail, Phone, Pencil, ShieldCheck, UserCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">{user.fullName}</h1>
          <p className="text-[14px] text-[#475569]">Kullanıcı profilini ve yetki bilgilerini görüntüleyin.</p>
        </div>
        <Link href={`/dashboard/users/${user.id}/edit`} className={cn(buttonVariants())}>
          <Pencil className="mr-2 h-4 w-4" /> Düzenle
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#1D4ED8]/20 bg-[#1D4ED8]/10 text-[#1D4ED8]">
                {user.image ? (
                  <img src={user.image} alt={user.fullName} className="h-full w-full object-cover" />
                ) : (
                  <UserCircle className="h-8 w-8" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A]">{user.fullName}</h2>
                <p className="text-sm text-[#475569]">{user.role === "ADMIN" ? "Yönetici" : "Danışman"}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <Mail className="h-4 w-4 text-slate-500" /> E-posta
                </div>
                <p className="text-sm text-[#475569]">{user.email}</p>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <Phone className="h-4 w-4 text-slate-500" /> Telefon
                </div>
                <p className="text-sm text-[#475569]">{user.phone || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yetki</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                <ShieldCheck className="h-4 w-4 text-slate-500" /> Rol
              </div>
              <p className="text-sm text-[#475569]">{user.role === "ADMIN" ? "Yönetici" : "Danışman"}</p>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="mb-2 text-sm font-semibold text-[#0F172A]">Durum</div>
              <p className="text-sm text-[#475569]">{user.isActive ? "Aktif" : "Pasif"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
