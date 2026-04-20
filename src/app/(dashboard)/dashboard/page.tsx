import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth/auth-options";
import { getDashboardStats } from "@/lib/queries/dashboard/get-dashboard-data";
import { 
  Building2, 
  Users, 
  CheckSquare, 
  ArrowUpRight, 
  Activity,
  Calendar,
  Clock,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = session.user as any;
  const { stats, upcomingTasks, recentLogs } = await getDashboardStats(user.role, user.id);

  const statCards = [
    {
      name: "Aktif Portföyler",
      value: stats.activeListings.toString(),
      href: "/dashboard/properties?status=ACTIVE",
      icon: Building2,
      accentBg: "bg-blue-50",
      accentBorder: "border-blue-100",
      accentIcon: "text-blue-600",
      accentHoverBg: "group-hover:bg-blue-100",
      trend: { value: "↑ 12%", label: "geçen haftadan", positive: true }
    },
    {
      name: "Toplam Müşteriler",
      value: stats.totalCustomers.toString(),
      href: "/dashboard/customers",
      icon: Users,
      accentBg: "bg-indigo-50",
      accentBorder: "border-indigo-100",
      accentIcon: "text-indigo-600",
      accentHoverBg: "group-hover:bg-indigo-100",
      trend: { value: "↑ 8%", label: "bu ay", positive: true }
    },
    {
      name: "Bekleyen Görevler",
      value: stats.pendingTasks.toString(),
      href: "/dashboard/tasks?status=TODO",
      icon: CheckSquare,
      accentBg: "bg-amber-50",
      accentBorder: "border-amber-100",
      accentIcon: "text-amber-600",
      accentHoverBg: "group-hover:bg-amber-100",
      trend: { value: "↓ 3", label: "kalan", positive: true }
    },
    {
      name: "Aktivite",
      value: recentLogs.length.toString(),
      href: user.role === "ADMIN" ? "/dashboard/activity" : "#",
      icon: Activity,
      accentBg: "bg-emerald-50",
      accentBorder: "border-emerald-100",
      accentIcon: "text-emerald-600",
      accentHoverBg: "group-hover:bg-emerald-100",
      trend: { value: "↑ 24", label: "son 7 günde", positive: true }
    },
  ];

  // Helper to determine activity marker color
  const getActivityColor = (summary: string) => {
    if (summary?.includes("silindi") || summary?.includes("kaldır"))
      return { bg: "bg-rose-50", border: "border-rose-200", icon: "text-rose-500" };
    if (summary?.includes("oluşturuldu") || summary?.includes("eklendi"))
      return { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600" };
    if (summary?.includes("güncellendi") || summary?.includes("düzenlendi"))
      return { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-500" };
    return { bg: "bg-slate-50", border: "border-slate-200", icon: "text-slate-500" };
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[34px] font-bold tracking-tight text-[#0F172A]">
          Hoş geldin, {user?.name.split(' ')[0]}
        </h1>
        <p className="text-[15px] text-[#475569]">
          {user.role === "ADMIN" 
            ? "İşte ofisinizin bugünkü performans özeti." 
            : "İşte bugünkü randevularınız ve portföy durumunuz."}
        </p>
      </div>

      {/* KPI Stats - Differentiated per module */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="group relative overflow-hidden border-[#E2E8F0] bg-white rounded-2xl shadow-card transition-all duration-200 hover:translate-y-[-2px] hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-6 pt-6">
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-widest">{stat.name}</span>
                <div className={cn("rounded-xl p-2.5 border transition-colors", stat.accentBg, stat.accentBorder, stat.accentHoverBg)}>
                  <stat.icon className={cn("h-4 w-4 transition-colors", stat.accentIcon)} />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-[36px] font-bold tabular-nums leading-none tracking-tight text-[#0F172A]">{stat.value}</div>
                <div className="mt-3 flex items-center gap-2 text-[12px]">
                  <span className={cn("inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full border", stat.trend.positive ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-600 bg-rose-50 border-rose-100")}>
                    {stat.trend.value}
                  </span>
                  <span className="text-[#94A3B8]">{stat.trend.label}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Upcoming Tasks Section */}
        <Card className="lg:col-span-7 bg-white rounded-2xl shadow-card border-[#E2E8F0] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#EEF2F7] px-8 py-5">
            <div className="space-y-1">
              <CardTitle className="text-[18px] font-semibold text-[#0F172A]">Yaklaşan Görevler</CardTitle>
              <p className="text-[13px] text-[#94A3B8]">Önümüzdeki 7 gün içindeki ajandanız.</p>
            </div>
            <Link href="/dashboard/tasks" className="text-[13px] font-bold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">Tümünü Gör</Link>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {upcomingTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-8 pb-16 text-center">
                  <div className="rounded-2xl bg-[#E0E7FF] p-6 mb-6">
                    <Calendar className="h-10 w-10 text-[#4F46E5]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Henüz görev yok</h3>
                  <p className="text-[14px] text-[#475569] mt-1 max-w-[260px] leading-relaxed">Bugün veya yakında planlanmış bir göreviniz bulunmuyor.</p>
                  <Link href="/dashboard/tasks/new" className={cn(buttonVariants(), "mt-6 rounded-xl px-6 font-bold shadow-md shadow-blue-900/10")}>Yeni Görev Ekle</Link>
                </div>
              ) : (
                upcomingTasks.map((task) => (
                  <div key={task.id} className="group flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 transition-all hover:bg-white hover:shadow-md hover:border-[#CBD5E1]">
                    <div className="flex items-center gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 transition-transform group-hover:scale-105">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[14px] font-semibold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors leading-none">{task.title}</p>
                        <div className="flex items-center gap-2.5 text-[12px] text-[#64748B]">
                          <span className="font-medium text-[#94A3B8]">
                            {task.customer?.fullName || "Genel"}
                          </span>
                          {task.listing?.title && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-slate-300" />
                              <span className="truncate max-w-[180px]">{task.listing.title}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right">
                      <span className="inline-flex items-center rounded-full bg-[#EEF2F7] border border-[#E2E8F0] px-3 py-1 text-[11px] font-bold text-[#475569]">
                        {formatDate(task.dueDate)}
                      </span>
                      <Link href={`/dashboard/tasks/${task.id}/edit`} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-blue-50 transition-all">
                        <ArrowUpRight className="h-4 w-4 text-[#1D4ED8]" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed Section */}
        <Card className="lg:col-span-5 bg-white rounded-2xl shadow-card border-[#E2E8F0] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#EEF2F7] px-8 py-5">
             <div className="space-y-1">
              <CardTitle className="text-[18px] font-semibold text-[#0F172A]">Akış</CardTitle>
              <p className="text-[13px] text-[#94A3B8]">Ofisinizdeki son hareketler.</p>
            </div>
            {user.role === "ADMIN" && (
              <Link href="/dashboard/activity" className="text-[13px] font-semibold text-[#64748B] hover:text-[#1D4ED8] transition-colors">Tüm Loglar</Link>
            )}
          </CardHeader>
          <CardContent className="p-8">
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[1.2rem] before:h-full before:w-[1px] before:bg-[#E2E8F0]">
              {recentLogs.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-16 text-center relative z-10 bg-white rounded-2xl">
                  <div className="rounded-2xl bg-[#EEF2F7] p-5 mb-4">
                    <Activity className="h-8 w-8 text-[#94A3B8]" />
                  </div>
                  <p className="text-[14px] text-[#475569]">Henüz bir aktivite kaydedilmedi.</p>
                </div>
              ) : (
                recentLogs.map((log) => {
                  const colors = getActivityColor(log.summary);
                  return (
                    <div key={log.id} className="relative z-10 flex items-start gap-5">
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[2px] border-white shadow-sm ring-4 ring-[#F1F5F9] mt-0.5",
                        colors.bg, colors.border
                      )}>
                        <Activity className={cn("h-[18px] w-[18px]", colors.icon)} />
                      </div>
                      <div className="flex flex-col gap-1.5 pt-1">
                        <p className="text-[13px] leading-relaxed text-[#334155]">
                          <span className="font-semibold text-[#0F172A]">{log.actor?.fullName}</span>
                          {" "}{log.summary}
                        </p>
                        <time className="text-[11px] font-semibold text-[#94A3B8]/80">
                          {formatDate(log.createdAt)}
                        </time>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
