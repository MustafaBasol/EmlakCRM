import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  ChevronRight, 
  MapPin, 
  Pencil, 
  Phone, 
  User 
} from "lucide-react";
import { authOptions } from "@/lib/auth/auth-options";
import { getListingById } from "@/lib/queries/listings/get-listings";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { ListingStatus, PropertyType } from "@prisma/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { id } = await params;
  const user = session.user as any;

  const listing = await getListingById(id, user.role, user.id);
  if (!listing) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/listings" className="hover:text-foreground">Portföyler</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate max-w-[200px]">{listing.title}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/listings" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
              <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">{listing.title}</h2>
        </div>
        <Link href={`/dashboard/listings/${listing.id}/edit`} className={cn(buttonVariants())}>
            <Pencil className="mr-2 h-4 w-4" /> Düzenle
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mülk Özeti</CardTitle>
              <Badge>{listing.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Fiyat</p>
                  <p className="text-lg font-bold">{formatCurrency(listing.price)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Tip</p>
                  <p className="text-lg font-bold">{listing.propertyType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Alan</p>
                  <p className="text-lg font-bold">{listing.areaSizeM2?.toString() || "-"} m²</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Oda</p>
                  <p className="text-lg font-bold">{listing.roomCount || "-"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" /> Konum
                </h4>
                <p className="text-slate-600">
                  {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
                  {listing.district}, {listing.city}
                </p>
                <p className="text-sm text-muted-foreground">{listing.addressText}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Açıklama</h4>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {listing.description || "Açıklama girilmemiş."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder for Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Fotoğraflar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-slate-50 text-muted-foreground text-sm">
                Henüz fotoğraf eklenmemiş.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">İlan Yönetimi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Atanan Danışman</p>
                  <p className="font-bold">{listing.assignedAgent?.fullName || "-"}</p>
                  {listing.assignedAgent?.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" /> {listing.assignedAgent.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Oluşturulma
                  </span>
                  <span className="font-medium">{formatDate(listing.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Ada / Parsel
                  </span>
                  <span className="font-medium">{listing.islandNo || "-"}/{listing.parcelNo || "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
