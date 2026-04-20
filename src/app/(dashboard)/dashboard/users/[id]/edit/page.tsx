import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db/db";
import { UserForm } from "@/components/users/user-form";

export const metadata: Metadata = {
  title: "Danışman Düzenle | Emlak CRM",
};

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">Danışman Düzenle</h1>
        <p className="text-[14px] text-[#475569]">
          {user.fullName} kullanıcısına ait profil bilgilerini veya yetki ayarlarını güncelleyin.
        </p>
      </div>

      <div className="w-full">
        <UserForm initialData={user} />
      </div>
    </div>
  );
}
