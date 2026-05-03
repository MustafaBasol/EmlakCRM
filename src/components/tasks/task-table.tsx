"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Circle,
  Clock,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { TaskPriority, TaskStatus } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import { toggleTaskStatusAction, deleteTaskAction } from "@/server/actions/task-actions";
import { cn } from "@/lib/utils";
import { TableRowActions } from "@/components/shared/table-row-actions";
import { taskPriorityLabels } from "@/lib/constants/enum-labels";
import { toast } from "sonner";

interface TaskTableProps {
  tasks: any[];
  isAdmin: boolean;
}

const priorityMap: Record<TaskPriority, { label: string; color: string }> = {
  LOW: {
    label: taskPriorityLabels.LOW,
    color: "text-slate-500 border-slate-200 bg-slate-50",
  },
  MEDIUM: {
    label: taskPriorityLabels.MEDIUM,
    color: "text-blue-600 border-blue-200 bg-blue-50",
  },
  HIGH: {
    label: taskPriorityLabels.HIGH,
    color: "text-orange-600 border-orange-200 bg-orange-50",
  },
  URGENT: {
    label: taskPriorityLabels.URGENT,
    color: "text-rose-600 border-rose-200 bg-rose-50",
  },
};

export function TaskTable({ tasks }: TaskTableProps) {
  const router = useRouter();

  const handleToggleStatus = async (id: string, status: TaskStatus) => {
    try {
      await toggleTaskStatusAction(id, status);
      toast.success("Görev durumu güncellendi.");
    } catch {
      toast.error("Bir hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await deleteTaskAction(id);
      toast.success("Görev silindi.");
    } catch {
      toast.error("Bir hata oluştu.");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
      <Table>
        <TableHeader className="bg-[#F8FAFC]">
          <TableRow className="border-b border-[#E2E8F0] hover:bg-transparent">
            <TableHead className="w-12 py-4 text-center" />
            <TableHead className="w-[320px] py-4 text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
              Görev
            </TableHead>
            <TableHead className="text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
              İlişkili Kayıt
            </TableHead>
            <TableHead className="w-[160px] text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
              Vade
            </TableHead>
            <TableHead className="w-[120px] text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
              Öncelik
            </TableHead>
            <TableHead className="w-[110px] text-right text-[13px] font-semibold uppercase tracking-wider text-[#475569]">
              Aksiyon
            </TableHead>
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
                    <p className="text-sm text-[#475569]">
                      Şu an için atanmış herhangi bir görev yok.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const isDone = task.status === "DONE";
              const isOverdue =
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== "DONE";

              return (
                <TableRow
                  key={task.id}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-[#F8FAFC]",
                    isDone && "opacity-60"
                  )}
                  onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                >
                  <TableCell className="w-12 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleToggleStatus(task.id, task.status);
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300" />
                      )}
                    </Button>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className={cn("font-medium", isDone && "line-through")}>
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="max-w-[280px] truncate text-xs text-muted-foreground">
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
                          onClick={(event) => event.stopPropagation()}
                          className="flex items-center text-xs text-muted-foreground transition-colors hover:text-primary hover:underline"
                        >
                          <User className="mr-1 h-3 w-3" />
                          {task.customer.fullName}
                        </Link>
                      )}

                      {task.listing && (
                        <Link
                          href={`/dashboard/properties/${task.listingId}`}
                          onClick={(event) => event.stopPropagation()}
                          className="flex items-center text-xs text-muted-foreground transition-colors hover:text-primary hover:underline"
                        >
                          <Building2 className="mr-1 h-3 w-3" />
                          {task.listing.title}
                        </Link>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-slate-400" />
                      <span className={cn(isOverdue && "font-medium text-rose-600")}>
                        {task.dueDate ? formatDate(task.dueDate) : "-"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border font-normal",
                        priorityMap[task.priority as TaskPriority].color
                      )}
                    >
                      {priorityMap[task.priority as TaskPriority].label}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <TableRowActions
                      actions={[
                        {
                          label: "Görüntüle",
                          icon: CheckCircle2,
                          href: `/dashboard/tasks/${task.id}`,
                        },
                        {
                          label: "Düzenle",
                          icon: Pencil,
                          href: `/dashboard/tasks/${task.id}/edit`,
                        },
                        {
                          label: "Sil",
                          icon: Trash2,
                          isDestructive: true,
                          onClick: () => handleDelete(task.id),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
