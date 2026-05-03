"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { UserCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserAction, updateUserAction } from "@/server/actions/user-actions";
import { userRoleLabels, userStatusOptions } from "@/lib/constants/enum-labels";

interface UserFormProps {
  initialData?: any;
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.image || null
  );

  const roleItems = Object.values(UserRole).map((role) => ({
    value: role,
    label: userRoleLabels[role],
  }));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const status = formData.get("status") as string;

    formData.append("isActive", status === "ACTIVE" ? "true" : "false");
    formData.delete("status");

    try {
      if (initialData) {
        await updateUserAction(initialData.id, formData);
        toast.success("Kullanıcı başarıyla güncellendi.");
      } else {
        await createUserAction(formData);
        toast.success("Kullanıcı başarıyla oluşturuldu.");
      }

      router.push("/dashboard/users");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-6 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-6 sm:flex-row sm:items-center">
        <div className="group relative">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[#1D4ED8]/20 bg-[#1D4ED8]/10 text-[#1D4ED8]">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profil"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircle className="h-12 w-12" />
            )}
          </div>
          <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Upload className="h-6 w-6 text-white" />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>

        <div className="flex-1 space-y-1 text-center sm:text-left">
          <p className="text-[16px] font-semibold text-[#0F172A]">Profil Fotoğrafı</p>
          <p className="text-[13px] text-[#64748B]">
            Kullanıcı için profesyonel bir profil fotoğrafı seçin. PNG, JPG
            veya WEBP formatında ve en fazla 5 MB olmalıdır.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">
            Ad Soyad
          </label>
          <Input
            name="fullName"
            required
            defaultValue={initialData?.fullName}
            placeholder="Örn: Ahmet Yılmaz"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">
            E-posta Adresi
          </label>
          <Input
            type="email"
            name="email"
            required
            defaultValue={initialData?.email}
            placeholder="Örn: ahmet@emlakcrm.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">
            Telefon
          </label>
          <Input
            name="phone"
            defaultValue={initialData?.phone || ""}
            placeholder="Örn: 0555 555 55 55"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">
            Sistem Rolü
          </label>
          <Select
            name="role"
            items={roleItems}
            defaultValue={initialData?.role || UserRole.AGENT}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleItems.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">Durum</label>
          <Select
            name="status"
            items={userStatusOptions}
            defaultValue={initialData?.isActive === false ? "PASSIVE" : "ACTIVE"}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {userStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">
            Şifre{" "}
            {initialData && (
              <span className="font-normal text-muted-foreground">
                (Değiştirmek istemiyorsanız boş bırakın)
              </span>
            )}
          </label>
          <Input
            type="password"
            name="password"
            required={!initialData}
            placeholder={
              initialData ? "Yeni şifre belirleyin..." : "Giriş şifresi belirleyin..."
            }
            minLength={6}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-[#E2E8F0] pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          İptal
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#1D4ED8] text-white hover:bg-[#1e40af]"
        >
          {loading
            ? "Kaydediliyor..."
            : initialData
              ? "Değişiklikleri Kaydet"
              : "Kullanıcıyı Oluştur"}
        </Button>
      </div>
    </form>
  );
}
