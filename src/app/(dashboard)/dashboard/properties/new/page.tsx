import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { ListingForm } from "@/components/listings/listing-form";
import { UserRole } from "@prisma/client";

export default async function NewListingPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = session.user as any;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Yeni İlan Ekle</h2>
        <p className="text-muted-foreground">
          Sisteme yeni bir gayrimenkul portforyu ekleyin.
        </p>
      </div>

      <ListingForm isAdmin={user.role === UserRole.ADMIN} />
    </div>
  );
}
