import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { TaskForm } from "@/components/tasks/task-form";
import { getCustomers } from "@/lib/queries/customers/get-customers";
import { getListings } from "@/lib/queries/listings/get-listings";

interface PageProps {
  searchParams: Promise<{
    customerId?: string;
    listingId?: string;
  }>;
}

export default async function NewTaskPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = session.user as any;
  const resolvedParams = await searchParams;
  const [customers, listings] = await Promise.all([
    getCustomers({ role: user.role, userId: user.id }),
    getListings({ role: user.role, userId: user.id }),
  ]);

  const initialData = {
    customerId: resolvedParams.customerId || "",
    listingId: resolvedParams.listingId || "",
    assignedToId: user.id,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Yeni Görev Oluştur</h2>
        <p className="text-muted-foreground">
          Randevu, yer gösterme veya takip görevi planlayın.
        </p>
      </div>

      <TaskForm
        currentUserId={user.id}
        initialData={initialData}
        customers={customers.map((customer) => ({
          id: customer.id,
          fullName: customer.fullName,
        }))}
        listings={listings.map((listing) => ({
          id: listing.id,
          title: listing.title,
        }))}
      />
    </div>
  );
}
