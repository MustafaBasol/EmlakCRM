import { Metadata } from "next";
import { UserForm } from "@/components/users/user-form";

export const metadata: Metadata = {
  title: "Yeni Danışman Ekle | Emlak CRM",
};

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">Yeni Danışman Ekle</h1>
        <p className="text-[14px] text-[#475569]">
          Sisteme yeni bir gayrimenkul danışmanı veya yönetici hesabı ekleyin.
        </p>
      </div>

      <div className="w-full">
        <UserForm />
      </div>
    </div>
  );
}
