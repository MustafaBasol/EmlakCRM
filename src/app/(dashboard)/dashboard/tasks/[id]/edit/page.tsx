import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { getTaskById } from "@/lib/queries/tasks/get-tasks";
import { TaskForm } from "@/components/tasks/task-form";
import { getCustomers } from "@/lib/queries/customers/get-customers";
import { getListings } from "@/lib/queries/listings/get-listings";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { id } = await params;
  const user = session.user as any;

  const [task, customers, listings] = await Promise.all([
    getTaskById(id, user.role, user.id),
    getCustomers({ role: user.role, userId: user.id }),
    getListings({ role: user.role, userId: user.id }),
  ]);
  if (!task) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Görevi Düzenle</h2>
        <p className="text-muted-foreground">
          "{task.title}" görev bilgilerini güncelleyin.
        </p>
      </div>

      <TaskForm 
        initialData={task} 
        currentUserId={user.id}
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
