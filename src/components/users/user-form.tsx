"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { createUserAction, updateUserAction } from "@/server/actions/user-actions";

interface UserFormProps {
  initialData?: any;
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Status is sent as active/passive to be boolean true/false
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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center sm:flex-row gap-6 p-6 border border-[#EEF2F7] rounded-xl bg-[#F8FAFC]">
        <div className="relative group">
          <div className="flex h-24 w-24 overflow-hidden items-center justify-center rounded-full bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 text-[#1D4ED8]">
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="h-12 w-12" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Upload className="h-6 w-6 text-white" />
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
          </div>
        </div>
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <p className="font-semibold text-[16px] text-[#0F172A]">Profil Fotoğrafı</p>
          <p className="text-[13px] text-[#64748B]">Kullanıcı için bir profesyonel profil fotoğrafı seçin. Maksimum 5MB boyutunda PNG, JPG veya WEBP olmalıdır.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">Ad Soyad</label>
          <Input name="fullName" required defaultValue={initialData?.fullName} placeholder="Örn: Ahmet Yılmaz" />
        </div>
        
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">E-posta Adresi</label>
          <Input type="email" name="email" required defaultValue={initialData?.email} placeholder="Örn: ahmet@emlakcrm.com" />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">Telefon</label>
          <Input name="phone" defaultValue={initialData?.phone || ""} placeholder="Örn: 0555 555 5555" />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">Sistem Rolü</label>
          <Select name="role" defaultValue={initialData?.role || UserRole.AGENT}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AGENT">Danışman</SelectItem>
              <SelectItem value="ADMIN">Yönetici</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">Durum</label>
          <Select name="status" defaultValue={initialData?.isActive === false ? "PASSIVE" : "ACTIVE"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Aktif (Giriş Yapabilir)</SelectItem>
              <SelectItem value="PASSIVE">Pasif (Dondurulmuş)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-[#0F172A]">
            Şifre {initialData && <span className="text-muted-foreground font-normal">(Değiştirmek istemiyorsanız boş bırakın)</span>}
          </label>
          <Input 
            type="password" 
            name="password" 
            required={!initialData} 
            placeholder={initialData ? "Yeni şifre belirleyin..." : "Giriş şifresi belirleyin..."} 
            minLength={6}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-[#E2E8F0]">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          İptal
        </Button>
        <Button type="submit" disabled={loading} className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white">
          {loading ? "Kaydediliyor..." : (initialData ? "Değişiklikleri Kaydet" : "Kullanıcıyı Oluştur")}
        </Button>
      </div>
    </form>
  );
}
