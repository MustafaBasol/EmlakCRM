"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { taskSchema, TaskInput } from "@/lib/validations/task";
import { createTaskAction, updateTaskAction } from "@/server/actions/task-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { taskPriorityLabels, taskStatusLabels } from "@/lib/constants/enum-labels";

interface TaskFormProps {
  initialData?: any;
  currentUserId: string;
  customers?: Array<{
    id: string;
    fullName: string;
  }>;
  listings?: Array<{
    id: string;
    title: string;
  }>;
}

export function TaskForm({
  initialData,
  currentUserId,
  customers = [],
  listings = [],
}: TaskFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  type TaskFormValues = z.input<typeof taskSchema>;

  const priorityItems = Object.values(TaskPriority).map((priority) => ({
    value: priority,
    label: taskPriorityLabels[priority],
  }));

  const statusItems = Object.values(TaskStatus).map((status) => ({
    value: status,
    label: taskStatusLabels[status],
  }));

  const customerItems = customers.map((customer) => ({
    value: customer.id,
    label: customer.fullName,
  }));

  const listingItems = listings.map((listing) => ({
    value: listing.id,
    label: listing.title,
  }));

  const form = useForm<TaskFormValues, unknown, TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          dueDate: initialData.dueDate ? new Date(initialData.dueDate) : undefined,
        }
      : {
          title: "",
          description: "",
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          assignedToId: currentUserId,
          customerId: "",
          listingId: "",
        },
  });

  const onSubmit = async (values: TaskInput) => {
    setLoading(true);

    try {
      if (initialData) {
        await updateTaskAction(initialData.id, values);
        toast.success("Görev güncellendi.");
      } else {
        await createTaskAction(values);
        toast.success("Görev planlandı.");
      }

      router.push("/dashboard/tasks");
      router.refresh();
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Görev Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Görev Başlığı</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn: Yer gösterme randevusu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Örn: Müşteri Beşiktaş'taki daireyi görmek istiyor..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planlama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Vade / Randevu Tarihi</FormLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !(field.value instanceof Date) && "text-muted-foreground"
                              )}
                            >
                              {field.value instanceof Date ? (
                                format(field.value, "PPP", { locale: tr })
                              ) : (
                                <span>Tarih seçin</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        }
                      />
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value instanceof Date ? field.value : undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Öncelik</FormLabel>
                      <Select
                        items={priorityItems}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityItems.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durum</FormLabel>
                      <Select
                        items={statusItems}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusItems.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bağlantılar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İlgili Müşteri</FormLabel>
                    <Select
                      items={[
                        { value: "__none__", label: "Seçilmedi" },
                        ...customerItems,
                      ]}
                      value={field.value || "__none__"}
                      onValueChange={(value) =>
                        field.onChange(value === "__none__" ? undefined : value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Müşteri seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">Seçilmedi</SelectItem>
                        {customerItems.map((customer) => (
                          <SelectItem key={customer.value} value={customer.value}>
                            {customer.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Görevin atanacağı müşteri.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="listingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İlgili Portföy</FormLabel>
                    <Select
                      items={[
                        { value: "__none__", label: "Seçilmedi" },
                        ...listingItems,
                      ]}
                      value={field.value || "__none__"}
                      onValueChange={(value) =>
                        field.onChange(value === "__none__" ? undefined : value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Portföy seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">Seçilmedi</SelectItem>
                        {listingItems.map((listing) => (
                          <SelectItem key={listing.value} value={listing.value}>
                            {listing.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Görevin ilgili olduğu mülk.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            İptal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Kaydediliyor..." : initialData ? "Güncelle" : "Kaydet"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
