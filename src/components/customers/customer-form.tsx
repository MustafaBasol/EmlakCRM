"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerCategory, CustomerStatus, PropertyType } from "@prisma/client";
import { z } from "zod";
import { customerSchema, CustomerInput } from "@/lib/validations/customer";
import { createCustomerAction, updateCustomerAction } from "@/server/actions/customer-actions";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  customerCategoryLabels,
  customerStatusLabels,
  propertyTypeLabels,
} from "@/lib/constants/enum-labels";

interface CustomerFormProps {
  initialData?: any;
  isAdmin: boolean;
}

export function CustomerForm({ initialData, isAdmin }: CustomerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  type CustomerFormValues = z.input<typeof customerSchema>;
  const categoryItems = Object.values(CustomerCategory).map((category) => ({
    value: category,
    label: customerCategoryLabels[category],
  }));
  const statusItems = Object.values(CustomerStatus).map((status) => ({
    value: status,
    label: customerStatusLabels[status],
  }));
  const propertyTypeItems = Object.values(PropertyType).map((type) => ({
    value: type,
    label: propertyTypeLabels[type],
  }));

  const form = useForm<CustomerFormValues, unknown, CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData ? {
      ...initialData,
      budgetMin: initialData.budgetMin ? Number(initialData.budgetMin) : undefined,
      budgetMax: initialData.budgetMax ? Number(initialData.budgetMax) : undefined,
    } : {
      fullName: "",
      phone: "",
      email: "",
      category: CustomerCategory.BUYER,
      status: CustomerStatus.NEW,
    },
  });

  const onSubmit = async (values: CustomerInput) => {
    setLoading(true);
    try {
      if (initialData) {
        await updateCustomerAction(initialData.id, values);
        toast.success("Müşteri kaydı güncellendi.");
      } else {
        await createCustomerAction(values);
        toast.success("Yeni müşteri kaydı oluşturuldu.");
      }
      router.push("/dashboard/customers");
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Soyad</FormLabel>
                    <FormControl>
                      <Input placeholder="Müşteri adını ve soyadını girin..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="05XX XXX XX XX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta (İsteğe bağlı)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="ornek@mail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* CRM Details */}
          <Card>
            <CardHeader>
              <CardTitle>CRM & Durum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select items={categoryItems} value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryItems.map((category) => (
                            <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
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
                      <Select items={statusItems} value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusItems.map((status) => (
                            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {isAdmin && (
                <FormField
                  control={form.control}
                  name="assignedAgentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Atanan Danışman</FormLabel>
                      <FormControl>
                        <Input placeholder="Danışman ID..." {...field} />
                      </FormControl>
                      <FormDescription>Müşteriyi yönetecek olan danışman.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Preferences (Buyers Specific) */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Tercihler & Notlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="desiredPropertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mülk Tercihi</FormLabel>
                      <Select items={propertyTypeItems} value={field.value ?? undefined} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {propertyTypeItems.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budgetMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min. Bütçe</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={typeof field.value === "number" ? field.value : ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budgetMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max. Bütçe</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={typeof field.value === "number" ? field.value : ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="preferredCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tercih Edilen Şehir</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredDistrict"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İlçe / Bölge</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notlar</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Müşteri hakkında ek notlar, özel istekler..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
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
            {loading ? "Kaydediliyor..." : (initialData ? "Güncelle" : "Kaydet")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
