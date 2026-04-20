import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import { getListingById } from "@/lib/queries/listings/get-listings";
import { ListingForm } from "@/components/listings/listing-form";
import { UserRole } from "@prisma/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { id } = await params;
  const user = session.user as any;

  const listing = await getListingById(id, user.role, user.id);
  if (!listing) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">İlanı Düzenle</h2>
        <p className="text-muted-foreground">
          "{listing.title}" portfory bilgilerini güncelleyin.
        </p>
      </div>

      <ListingForm 
        initialData={listing} 
        isAdmin={user.role === UserRole.ADMIN} 
      />
    </div>
  );
}
