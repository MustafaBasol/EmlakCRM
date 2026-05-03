import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Calendar, ChevronRight, Pencil, User, Building2, Clock } from "lucide-react";
import { authOptions } from "@/lib/auth/auth-options";
import { getTaskById } from "@/lib/queries/tasks/get-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/format";
import { taskPriorityLabels, taskStatusLabels } from "@/lib/constants/enum-labels";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { id } = await params;
  const user = session.user as any;

  const task = await getTaskById(id, user.role, user.id);
  if (!task) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/tasks" className="hover:text-foreground">Görevler</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="max-w-[240px] truncate text-foreground">{task.title}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">{task.title}</h1>
          <p className="text-[14px] text-[#475569]">Görev detaylarını görüntüleyin.</p>
        </div>
        <Link href={`/dashboard/tasks/${task.id}/edit`} className={cn(buttonVariants())}>
          <Pencil className="mr-2 h-4 w-4" /> Düzenle
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Görev Özeti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge>{taskStatusLabels[task.status]}</Badge>
              <Badge variant="outline">{taskPriorityLabels[task.priority]}</Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <Clock className="h-4 w-4 text-slate-500" /> Vade Tarihi
                </div>
                <p className="text-sm text-[#475569]">{formatDate(task.dueDate)}</p>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <Calendar className="h-4 w-4 text-slate-500" /> Oluşturulma
                </div>
                <p className="text-sm text-[#475569]">{formatDate(task.createdAt)}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#475569]">Açıklama</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-[#334155]">
                {task.description || "Açıklama girilmemiş."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bağlantılar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Atanan Danışman</p>
              <div className="flex items-center gap-2 text-sm text-[#0F172A]">
                <User className="h-4 w-4 text-slate-500" />
                {task.assignedTo?.fullName || "-"}
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Müşteri</p>
              {task.customer ? (
                <Link href={`/dashboard/customers/${task.customerId}`} className="inline-flex items-center gap-2 text-sm text-[#1D4ED8] hover:underline">
                  <User className="h-4 w-4" />
                  {task.customer.fullName}
                </Link>
              ) : (
                <p className="text-sm text-[#475569]">-</p>
              )}
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Portföy</p>
              {task.listing ? (
                <Link href={`/dashboard/properties/${task.listingId}`} className="inline-flex items-center gap-2 text-sm text-[#1D4ED8] hover:underline">
                  <Building2 className="h-4 w-4" />
                  {task.listing.title}
                </Link>
              ) : (
                <p className="text-sm text-[#475569]">-</p>
              )}
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Oluşturan</p>
              <p className="text-sm text-[#0F172A]">{task.createdBy?.fullName || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
