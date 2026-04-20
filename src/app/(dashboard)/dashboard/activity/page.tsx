import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import { getActivities } from "@/lib/queries/activity/get-logs";
import { ActivityActionType, UserRole } from "@prisma/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import { Activity, ShieldCheck, User } from "lucide-react";

function getActionBadgeColors(actionType: ActivityActionType) {
  switch (actionType) {
    case ActivityActionType.USER_CREATED:
    case ActivityActionType.LISTING_CREATED:
    case ActivityActionType.CUSTOMER_CREATED:
    case ActivityActionType.TASK_CREATED:
    case ActivityActionType.SHOWING_CREATED:
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case ActivityActionType.USER_UPDATED:
    case ActivityActionType.LISTING_UPDATED:
    case ActivityActionType.LISTING_STATUS_CHANGED:
    case ActivityActionType.CUSTOMER_UPDATED:
    case ActivityActionType.CUSTOMER_STATUS_CHANGED:
    case ActivityActionType.TASK_UPDATED:
    case ActivityActionType.TASK_STATUS_CHANGED:
    case ActivityActionType.SHOWING_UPDATED:
      return "bg-blue-50 text-blue-700 border-blue-200";
    case ActivityActionType.USER_DEACTIVATED:
      return "bg-rose-50 text-rose-700 border-rose-200";
    case ActivityActionType.LOGIN:
    default:
      return "bg-[#EEF2F7] text-[#475569] border-[#E2E8F0]";
  }
}

export default async function ActivityPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = session.user as any;
  
  // Security check
  if (user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const { logs } = await getActivities();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
          <Activity className="h-8 w-8 text-[#64748B]" /> Aktivite Kayıtları
        </h1>
        <p className="text-[14px] text-[#475569]">
          Sistem üzerinde gerçekleşen tüm işlemleri ve değişiklikleri takip edin.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-card overflow-hidden">
        <div className="border-b border-[#EEF2F7] px-6 py-4">
          <h3 className="font-semibold text-[#0F172A]">Sistem Denetim Kaydı</h3>
        </div>
        <Table>
          <TableHeader className="bg-[#F8FAFC]">
            <TableRow className="hover:bg-transparent border-b border-[#E2E8F0]">
              <TableHead className="w-[180px] text-[13px] font-semibold text-[#475569] uppercase tracking-wider py-4">Tarih</TableHead>
              <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Kullanıcı</TableHead>
              <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">İşlem</TableHead>
              <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Modül</TableHead>
              <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Detay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF2F7]">
                        <Activity className="h-6 w-6 text-[#94A3B8]" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-[#0F172A]">Kayıt Yok</p>
                        <p className="text-sm text-[#475569]">Şu an için sistemde bir aktivite bulunmuyor.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => {
                  const badgeColors = getActionBadgeColors(log.actionType);

                  return (
                    <TableRow key={log.id} className="transition-colors hover:bg-[#F8FAFC]">
                      <TableCell className="text-[13px] text-[#475569] font-medium">
                        {formatDate(log.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex bg-[#F1F5F9] border border-[#E2E8F0] p-1.5 rounded-full">
                            {log.actor?.role === "ADMIN" ? (
                              <ShieldCheck className="h-3.5 w-3.5 text-[#1D4ED8]" />
                            ) : (
                              <User className="h-3.5 w-3.5 text-[#64748B]" />
                            )}
                          </div>
                          <span className="text-[13px] font-semibold text-[#0F172A]">{log.actor?.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider rounded-md border py-0.5 px-2 ${badgeColors}`}>
                          {log.actionType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-[13px] font-medium text-[#64748B] bg-[#F8FAFC] border border-[#EEF2F7] px-2.5 py-1 rounded-md">{log.entityType}</span>
                      </TableCell>
                      <TableCell className="text-[13px] text-[#334155] max-w-md truncate">
                        {log.summary}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
