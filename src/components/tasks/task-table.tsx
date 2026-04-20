"use client";

import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  AlertCircle,
  Building2,
  User 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { TaskStatus, TaskPriority } from "@prisma/client";
import { formatDate } from "@/lib/utils/format";
import { toggleTaskStatusAction, deleteTaskAction } from "@/server/actions/task-actions";
import { cn } from "@/lib/utils";
import { TableRowActions } from "@/components/shared/table-row-actions";
import { toast } from "sonner";
import Link from "next/link";

interface TaskTableProps {
  tasks: any[];
  isAdmin: boolean;
}

const priorityMap: Record<TaskPriority, { label: string; color: string }> = {
  LOW: { label: "Düşük", color: "text-slate-500 bg-slate-50 border-slate-200" },
  MEDIUM: { label: "Orta", color: "text-blue-600 bg-blue-50 border-blue-200" },
  HIGH: { label: "Yüksek", color: "text-orange-600 bg-orange-50 border-orange-200" },
  URGENT: { label: "Acil", color: "text-rose-600 bg-rose-50 border-rose-200" },
};

export function TaskTable({ tasks, isAdmin }: TaskTableProps) {
  const handleToggleStatus = async (id: string, status: string) => {
    try {
      await toggleTaskStatusAction(id, status);
      toast.success("Görev durumu güncellendi.");
    } catch (error) {
      toast.error("Bir hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
    try {
      await deleteTaskAction(id);
      toast.success("Görev silindi.");
    } catch (error) {
      toast.error("Bir hata oluştu.");
    }
  };

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-card overflow-hidden">
      <Table>
        <TableHeader className="bg-[#F8FAFC]">
          <TableRow className="hover:bg-transparent border-b border-[#E2E8F0]">
            <TableHead className="w-[300px] text-[13px] font-semibold text-[#475569] uppercase tracking-wider py-4">Görev</TableHead>
            <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">İlişkili Kayıt</TableHead>
            <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Vade / Öncelik</TableHead>
            <TableHead className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Durum</TableHead>
            <TableHead className="text-right text-[13px] font-semibold text-[#475569] uppercase tracking-wider">Aksiyon</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF2F7]">
                    <CheckCircle2 className="h-6 w-6 text-[#94A3B8]" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-[#0F172A]">Görev bulunamadı</p>
                    <p className="text-sm text-[#475569]">Şu an için atanan herhangi bir görev yok.</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id} className={cn("transition-colors hover:bg-[#F8FAFC]", task.status === "DONE" && "opacity-60")}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleToggleStatus(task.id, task.status)}
                  >
                    {task.status === "DONE" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className={cn("font-medium", task.status === "DONE" && "line-through")}>
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {task.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {task.customer && (
                      <Link 
                        href={`/dashboard/customers/${task.customerId}`}
                        className="flex items-center text-xs text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        <User className="mr-1 h-3 w-3" /> {task.customer.fullName}
                      </Link>
                    )}
                    {task.listing && (
                      <Link 
                        href={`/dashboard/properties/${task.listingId}`}
                        className="flex items-center text-xs text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        <Building2 className="mr-1 h-3 w-3" /> {task.listing.title}
                      </Link>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-slate-400" />
                    <span className={cn(
                      new Date(task.dueDate) < new Date() && task.status !== "DONE" && "text-rose-600 font-medium"
                    )}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-normal border", priorityMap[task.priority as TaskPriority].color)}>
                    {priorityMap[task.priority as TaskPriority].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <TableRowActions 
                    actions={[
                      { label: "Tamamla", icon: CheckCircle2, isMobileOnly: false, onClick: () => {} }, // Placeholder
                      { label: "Düzenle", icon: Pencil, href: `/dashboard/tasks/${task.id}/edit` },
                      { label: "Sil", icon: Trash2, isDestructive: true, onClick: () => handleDelete(task.id) }
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
