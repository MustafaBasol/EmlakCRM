import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { CustomerForm } from "@/components/customers/customer-form";
import { UserRole } from "@prisma/client";

export default async function NewCustomerPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = session.user as any;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Yeni Müşteri Ekle</h2>
        <p className="text-muted-foreground">
          CRM sistemine yeni bir müşteri aday veya lead kaydı ekleyin.
        </p>
      </div>

      <CustomerForm isAdmin={user.role === UserRole.ADMIN} />
    </div>
  );
}
