import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCircle, Shield, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Ayarlar | Emlak CRM",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">Ayarlar</h1>
        <p className="text-[14px] text-[#475569]">
          Profil bilgilerinizi ve uygulama ayarlarını yönetin.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-card overflow-hidden">
          <div className="border-b border-[#EEF2F7] px-6 py-5">
            <h3 className="font-semibold text-[#0F172A]">Profil Bilgileri</h3>
            <p className="text-[13px] text-[#64748B] mt-1">Giriş yaptığınız kullanıcı detayları.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 p-5 border border-[#EEF2F7] rounded-xl bg-[#F8FAFC]">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 shrink-0">
                <UserCircle className="h-7 w-7 text-[#1D4ED8]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-bold text-[16px] text-[#0F172A] truncate">{user?.name}</p>
                <p className="text-[13px] text-[#64748B]">Sistem Kullanıcısı</p>
              </div>
            </div>

            <div className="space-y-4 px-1">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F5F9] border border-[#E2E8F0]">
                  <Mail className="h-4 w-4 text-[#64748B]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">E-posta</span>
                  <span className="text-[14px] font-medium text-[#0F172A]">{user?.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F5F9] border border-[#E2E8F0]">
                  <Shield className="h-4 w-4 text-[#64748B]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Rol</span>
                  <span className="text-[14px] font-medium">
                    {(user as any)?.role === "ADMIN" ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-[13px] font-semibold text-[#1D4ED8] border border-blue-200">Yönetici</span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-slate-50 px-2.5 py-0.5 text-[13px] font-semibold text-slate-700 border border-slate-200">Danışman</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-card overflow-hidden">
          <div className="border-b border-[#EEF2F7] px-6 py-5">
            <h3 className="font-semibold text-[#0F172A]">Sistem Tercihleri</h3>
            <p className="text-[13px] text-[#64748B] mt-1">Uygulama bildirim ve görünüm ayarları.</p>
          </div>
          <div className="p-6 h-[calc(100%-80px)] flex items-center justify-center">
            <div className="flex flex-col items-center text-center p-8 border-2 border-dashed border-[#E2E8F0] rounded-xl bg-[#F8FAFC]/50 w-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9] mb-4">
                <Shield className="h-6 w-6 text-[#94A3B8]" />
              </div>
              <p className="font-semibold text-[#0F172A]">Yakında Geliyor</p>
              <p className="text-[13px] text-[#64748B] mt-1 max-w-[200px]">
                Bu modül bir sonraki güncellemede aktif olacaktır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
