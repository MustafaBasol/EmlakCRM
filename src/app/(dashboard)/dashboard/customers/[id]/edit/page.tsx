import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { getCustomerById } from "@/lib/queries/customers/get-customers";
import { CustomerForm } from "@/components/customers/customer-form";
import { UserRole } from "@prisma/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { id } = await params;
  const user = session.user as any;

  const customer = await getCustomerById(id, user.role, user.id);
  if (!customer) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Müşteri Kaydını Düzenle</h2>
        <p className="text-muted-foreground">
          "{customer.fullName}" bilgilerini ve tercihlerini güncelleyin.
        </p>
      </div>

      <CustomerForm 
        initialData={customer} 
        isAdmin={user.role === UserRole.ADMIN} 
      />
    </div>
  );
}
